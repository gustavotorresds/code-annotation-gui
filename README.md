# Code Annotation GUI
This is a simple Web Interface to support the work of my team’s project in CS 221. Our task is to create a computer-assisted system for code style grading for CS 106A assignments. This system would not replace section leader grading but instead help make grading faster and more efficient.

## Motivation
We first gathered students’ submissions from the past few quarters at Stanford. After that, we identified the need of hand-labeling a few samples in order to test the first iterations of our AI-model. For such hand-labeling, we needed a GUI that allowed us to:
1. Upload a student’s submission;
2. Assign grades to code sections in that submission;
3. Download a CSV file containing the lines we grades and the grades associated with each of those lines.

You can find a working prototype of this GUI [here](https://gustavotorresds.github.io/code-annotation-gui).

## TO-DOs
* Find a better way to identify selected rows (it’s currently just an index);
* Use some standard library to represent tuples of (start line, end line) that compose the keys of our map from (code section) => grade
* Code clean-up.