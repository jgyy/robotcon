# Path Planning Basics — Unit 6: Final Project - Roadmap Based Path Planning

This closing unit ties the course together by applying Dijkstra's algorithm — the very first thing you implemented in Unit 2 — to a real road network instead of a synthetic grid, using OpenStreetMap data. It's a deliberate full-circle exercise: same algorithm, much messier and more realistic input.

## Why roadmap-based planning is different
A city street network is naturally a graph already — intersections are nodes, road segments between them are edges weighted by distance (or travel time) — so it doesn't need the grid discretization step Units 2-3 relied on. That makes it a clean testbed for revisiting Dijkstra without the added complexity of RRT/APF-style continuous space, while still being a meaningfully harder and messier graph than a hand-drawn grid: roads are one-way, intersections have irregular degree, and the "shortest" path by distance often isn't the best path by travel time.

## Introducing OpenStreetMap (OSM)
OpenStreetMap is a free, community-maintained map of the world, and its data model maps naturally onto a path-planning graph: **nodes** are points (often intersections or points along a road), and **ways** are ordered sequences of nodes representing roads, paths, or other linear features, tagged with attributes like `highway=residential` or `oneway=yes`. For a road-constrained robot (or a simulated vehicle), you extract the road network as a graph — nodes as planning graph vertices, ways as edges — and run Dijkstra or A* directly on it.

## Using OSM data with ROS 2
Several community packages exist for pulling OSM data into a ROS 2 workflow and converting it into a routable graph and/or costmap-compatible representation, letting you combine a real-world road network with the same navigation stack you've used in earlier units' Gazebo tests. In practice this workflow looks like:
1. Export or download an OSM extract (a `.osm` XML file) covering your area of interest.
2. Parse it into a graph — nodes keyed by OSM node ID, edges from consecutive nodes along each `way`, weighted by segment distance (and filtered to exclude non-drivable/non-traversable way types for your robot).
3. Run your Unit 2 Dijkstra implementation (or Unit 3's A*) directly on this graph — no grid required, since the graph already only contains valid intersections and road segments.

## Starter code sketch for the project
A minimal OSM-to-graph loader looks like this (using `defusedxml` on a raw `.osm` export — a full project would typically use a dedicated OSM-parsing library instead of hand-rolling XML parsing). Note the `defusedxml` import: OSM files are external, untrusted data, and Python's stdlib `xml.etree.ElementTree` is vulnerable to XXE and entity-expansion ("billion laughs") attacks if pointed at a malicious file — `defusedxml` is a drop-in replacement that disables those dangerous features:
```python
from defusedxml import ElementTree as ET
from collections import defaultdict

def load_osm_graph(osm_path):
    tree = ET.parse(osm_path)
    root = tree.getroot()

    node_coords = {}
    for node in root.findall('node'):
        node_coords[node.get('id')] = (float(node.get('lat')), float(node.get('lon')))

    graph = defaultdict(dict)
    for way in root.findall('way'):
        tags = {t.get('k'): t.get('v') for t in way.findall('tag')}
        if 'highway' not in tags:
            continue  # skip non-road ways
        refs = [nd.get('ref') for nd in way.findall('nd')]
        oneway = tags.get('oneway') == 'yes'
        for a, b in zip(refs, refs[1:]):
            d = haversine(node_coords[a], node_coords[b])
            graph[a][b] = d
            if not oneway:
                graph[b][a] = d
    return graph, node_coords
```
Feed the resulting `graph` dict straight into an adjacency-list version of your Unit 2 `dijkstra` function — the algorithm itself doesn't change at all, only the source of the graph.

## Project outcome
By the end of this project you should have: an OSM extract for a real area, a graph loader that turns it into the same node/edge representation your search algorithms already understand, a working shortest-route query between two real-world coordinates, and (optionally) the route visualized on the map or driven by a simulated ground robot constrained to the road network. The deliverable is less about writing new algorithmic code — you already have that — and more about the very real engineering work of turning messy real-world data into the clean graph abstraction your algorithms expect.

## Try it yourself
Pick a small real neighborhood you know, grab an OSM extract covering it, and run the loader above followed by your Unit 2 Dijkstra implementation between two landmarks you recognize. Compare the computed route to the route you'd actually walk or drive — where they differ, inspect whether it's because of one-way restrictions, a `highway` tag you didn't intend to exclude, or a genuinely shorter path you hadn't considered.
