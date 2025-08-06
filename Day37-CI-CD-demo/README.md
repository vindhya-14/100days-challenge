# Day 37 – CI/CD Demo 🚀

This is a simple **CI/CD pipeline example** using:
- **GitHub Actions** for automated testing and deployment
- **Netlify** for hosting
- **Python + Pytest** for basic tests

Whenever changes are pushed to `main`:
1. GitHub Actions runs tests inside the `Day37-CI-CD-demo` folder.
2. If tests pass, the project is deployed to Netlify via the Netlify CLI.
