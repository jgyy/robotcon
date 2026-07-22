# Generative AI for Robotics — Unit 3: Training and Fine-Tuning Generative Models

With tokenization understood, this unit turns tokenized data into an actual trained model. You'll preprocess real data into training-ready batches, fine-tune a pretrained model efficiently, validate it against real predictions, and — to fully demystify the process — train a small generative model from scratch.

## From tokenized text to a trained model
There are two very different paths to a working model, and knowing when to use which is a core practical skill:
- **Fine-tuning** takes a model already pretrained on a huge general corpus and continues training it on your smaller, task-specific dataset. This is dramatically cheaper and is almost always the right default.
- **Training from scratch** starts from randomly initialized weights. It's slower and needs far more data, but it's worth doing at least once so you understand what fine-tuning is actually building on top of.

Both paths share the same preprocessing and training-loop mechanics — the difference is just the starting weights and how much data/compute you throw at it.

## Preprocessing data for training
Raw text (or audio, images, or a mix — multimodal data) can't go straight into a model; it has to become fixed-shape tensors. The core operations are **padding** (so every sequence in a batch is the same length), **truncation** (so no sequence exceeds the model's max length), and **batching** (grouping examples together for efficient GPU use):
```python
from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("bert-base-uncased")
batch = tok(
    ["Pick up the red block.", "Go to the kitchen and stop."],
    padding=True, truncation=True, max_length=32, return_tensors="pt",
)
# batch["input_ids"].shape == (2, longest_sequence_in_batch)
```
For images, the equivalent preprocessing is resizing, normalizing, and converting to tensors (via a `Processor` in the Hugging Face ecosystem); for audio, it's resampling and framing into spectrograms. The `datasets` library's `.map()` lets you apply this preprocessing across an entire dataset once and cache the result, instead of re-tokenizing on every epoch.

## Fine-tuning a pretrained model efficiently
Fine-tuning BERT on a classification task — say, predicting a 1-5 star rating from Yelp review text — follows a standard recipe: load data, tokenize it, configure a `Trainer`, and run.
```python
from transformers import AutoModelForSequenceClassification, TrainingArguments, Trainer

model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=5)

args = TrainingArguments(
    output_dir="bert-yelp", per_device_train_batch_size=16,
    num_train_epochs=2, fp16=True, eval_strategy="epoch",
)
trainer = Trainer(model=model, args=args, train_dataset=train_ds, eval_dataset=eval_ds)
trainer.train()
trainer.save_model("bert-yelp-final")
```
`fp16=True` (mixed precision) is worth turning on whenever your GPU supports it — it roughly halves memory use and often speeds up training with negligible accuracy cost. Once trained, validate the model on inputs it has never seen, not just the held-out eval split:
```python
from transformers import pipeline

classify = pipeline("text-classification", model="bert-yelp-final", tokenizer=tok)
classify("The service was slow but the food was excellent.")
```
This step — running real predictions on fresh input — is what actually proves the training pipeline works end to end, rather than just that the loss went down.

## Training a generative model from scratch
To train a language model rather than fine-tune one, you need a tokenizer trained on your target domain (Unit 2), a model architecture initialized with random weights, and a masked- or next-token-prediction training objective. A small RoBERTa (~84M parameters) trained from scratch on a modest corpus (e.g. a language-specific one like Esperanto, or a stylistic one like Dr. Seuss text for a GPT-style model) is enough to see real, coherent generations emerge:
```python
from transformers import RobertaConfig, RobertaForMaskedLM, DataCollatorForLanguageModeling

config = RobertaConfig(vocab_size=8000, max_position_embeddings=514, num_hidden_layers=6)
model = RobertaForMaskedLM(config=config)
collator = DataCollatorForLanguageModeling(tokenizer=my_tokenizer, mlm_probability=0.15)
```
Training from scratch is the clearest place to feel the difference hardware makes — the same run that takes minutes on a GPU can take hours on CPU, since every one of the model's randomly-initialized weights has to be moved by gradient descent, with no pretrained head start.

## Try it yourself
Fine-tune a small pretrained classifier (`distilbert-base-uncased` is a good lightweight choice) on any small labeled text dataset you can find or construct in ten minutes (even 100 hand-labeled sentences into 2-3 categories works). Save it, then write a five-line script using `pipeline()` to run it on three sentences you invented yourself — sentences the model has never seen — and check whether its predictions actually match your intuition.
