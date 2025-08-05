import os
from flask import Flask, render_template, request, send_file, flash
from pypdf import PdfReader, PdfWriter
from werkzeug.utils import secure_filename
import shutil

# Create folders for uploads and outputs
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["SECRET_KEY"] = "your-secret-key-here"  # Needed for flashing messages

def clear_folder(folder):
    """Clear all files in the specified folder"""
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f"Failed to delete {file_path}. Reason: {e}")

@app.route("/", methods=["GET", "POST"])
def index():
    message = ""
    message_type = "success"  # or "error"
    output_file = None

    if request.method == "POST":
        action = request.form.get("action")

        # Clear previous files
        clear_folder(UPLOAD_FOLDER)
        clear_folder(OUTPUT_FOLDER)

        # --- MERGE PDFs ---
        if action == "merge":
            files = request.files.getlist("pdf_files")
            if len(files) < 2:
                message = "Error: Please upload at least two PDF files to merge."
                message_type = "error"
            else:
                try:
                    writer = PdfWriter()
                    valid_files = 0
                    
                    for file in files:
                        if file.filename == '':
                            continue
                            
                        filename = secure_filename(file.filename)
                        if not filename.lower().endswith('.pdf'):
                            continue
                            
                        filepath = os.path.join(UPLOAD_FOLDER, filename)
                        file.save(filepath)

                        try:
                            reader = PdfReader(filepath)
                            for page in reader.pages:
                                writer.add_page(page)
                            valid_files += 1
                        except Exception as e:
                            print(f"Error reading {filename}: {str(e)}")
                            continue

                    if valid_files < 2:
                        message = "Error: Need at least 2 valid PDF files to merge."
                        message_type = "error"
                    else:
                        output_path = os.path.join(OUTPUT_FOLDER, "merged.pdf")
                        with open(output_path, "wb") as f:
                            writer.write(f)

                        output_file = "merged.pdf"
                        message = f"Success! {valid_files} PDFs merged successfully!"
                        message_type = "success"
                        
                except Exception as e:
                    message = f"Error merging PDFs: {str(e)}"
                    message_type = "error"

        # --- SPLIT PDF ---
        elif action == "split":
            file = request.files.get("pdf_file")
            start_page = request.form.get("start_page")
            end_page = request.form.get("end_page")

            if not file or file.filename == '':
                message = "Error: Please select a PDF file to split."
                message_type = "error"
            elif not start_page or not end_page:
                message = "Error: Please enter both start and end pages."
                message_type = "error"
            else:
                try:
                    filename = secure_filename(file.filename)
                    if not filename.lower().endswith('.pdf'):
                        message = "Error: Only PDF files are allowed."
                        message_type = "error"
                    else:
                        filepath = os.path.join(UPLOAD_FOLDER, filename)
                        file.save(filepath)

                        reader = PdfReader(filepath)
                        total_pages = len(reader.pages)
                        
                        try:
                            start = int(start_page) - 1  # zero-based index
                            end = int(end_page)
                            
                            if start < 0 or end > total_pages or start >= end:
                                message = f"Error: Invalid page range. PDF has {total_pages} pages."
                                message_type = "error"
                            else:
                                writer = PdfWriter()
                                for i in range(start, end):
                                    writer.add_page(reader.pages[i])

                                output_path = os.path.join(OUTPUT_FOLDER, "split.pdf")
                                with open(output_path, "wb") as f:
                                    writer.write(f)

                                output_file = "split.pdf"
                                message = f"Success! PDF split from page {start+1} to {end}."
                                message_type = "success"
                                
                        except ValueError:
                            message = "Error: Page numbers must be integers."
                            message_type = "error"
                            
                except Exception as e:
                    message = f"Error processing PDF: {str(e)}"
                    message_type = "error"

    return render_template(
        "index.html",
        message=message,
        message_type=message_type,
        output_file=output_file
    )

@app.route("/download/<filename>")
def download(filename):
    path = os.path.join(OUTPUT_FOLDER, filename)
    
    # Security check
    if not os.path.exists(path):
        return "File not found", 404
        
    if not filename.lower().endswith('.pdf'):
        return "Invalid file type", 400
        
    return send_file(path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)