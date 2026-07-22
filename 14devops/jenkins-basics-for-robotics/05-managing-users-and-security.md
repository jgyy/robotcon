# Jenkins Basics for Robotics — Unit 5: Managing Users and Security

A Jenkins instance that can build, test, and deploy code is a powerful thing to leave wide open. This unit covers locking it down: who can log in, and what they're allowed to do once they have.

## Authentication vs. authorization
These are two separate questions Jenkins security answers independently, under **Manage Jenkins → Security**:

- **Authentication** — *who are you?* Configured under "Security Realm". Options include Jenkins' own built-in user database, delegating to your company's LDAP/Active Directory, or an OAuth-based plugin (GitHub, Google). For personal or small-team use, "Jenkins' own user database" with "Allow users to sign up" turned **off** (so only admins create accounts) is the sane default.
- **Authorization** — *what are you allowed to do?* Configured under "Authorization". This determines whether an authenticated user can view, configure, build, or administer jobs.

## Authorization strategies
Three strategies matter most in practice:

- **Anyone can do anything** — never use this beyond a throwaway local test; it means an unauthenticated visitor can trigger builds or read credentials.
- **Logged-in users can do anything** — better, but still gives every authenticated user full admin rights. Fine for a solo learning setup, risky the moment you add collaborators.
- **Matrix-based security** (or **Role-Based Strategy**, via the Role-based Authorization Strategy plugin) — grants specific permissions (Job/Build, Job/Configure, Overall/Administer, etc.) to specific users or groups. This is what you'd actually use once more than one person touches the instance.

With the Role-based Authorization Strategy plugin installed, you define roles under **Manage Jenkins → Manage and Assign Roles**:

```
Role "developer":
  Overall/Read, Job/Build, Job/Read, Job/Workspace

Role "maintainer":
  everything "developer" has, plus Job/Configure, Job/Create, Job/Delete

Role "admin":
  Overall/Administer
```

Then assign users or groups to roles under **Manage and Assign Roles → Assign Roles**. This lets a robotics team give most contributors "developer" (they can trigger builds and see results) while only a couple of people hold "maintainer" (they can change what a pipeline does) or "admin" (they can change security itself).

## Managing users
Individual accounts live under **Manage Jenkins → Users**. From here you can create accounts, delete stale ones, and — importantly — each user manages their own **API Token** under their account's **Configure** page, used for CLI and scripted access (you'll use this in Unit 9) instead of their real password.

## Credentials, not secrets in plaintext
Never put passwords, API keys, or SSH private keys directly in a shell build step or a `Jenkinsfile`. Use **Manage Jenkins → Credentials** to store them (as "Secret text", "Username with password", or "SSH Username with private key"), each with an ID string. Jenkins masks their values in console output automatically when they're referenced correctly:

```groovy
// referencing a stored credential in a pipeline (previewed here, covered in Unit 6)
withCredentials([usernamePassword(credentialsId: 'robot-fleet-api', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
    sh 'curl -u $USER:$PASS https://fleet.example.internal/deploy'
}
```

## Try it yourself
Install the Role-based Authorization Strategy plugin, switch Authorization to it, and define two roles: `builder` (Overall/Read, Job/Build, Job/Read) and `admin` (Overall/Administer). Create a second local user account, assign it the `builder` role, then log in as that user in a private browser window and confirm it can trigger your `hello-jenkins` job from Unit 3 but cannot reach **Manage Jenkins**.
