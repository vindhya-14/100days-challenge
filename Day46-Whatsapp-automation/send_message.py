import pywhatkit as kit
import tkinter as tk
from tkinter import messagebox
from tkinter import PhotoImage

# Function to send message
def send_message():
    phone = phone_entry.get()
    msg = msg_entry.get("1.0", tk.END).strip()
    hour = hour_entry.get()
    minute = minute_entry.get()

    if not phone or not msg or not hour or not minute:
        messagebox.showwarning("Input Error", "All fields are required!")
        return

    try:
        hour = int(hour)
        minute = int(minute)
        kit.sendwhatmsg(phone, msg, hour, minute)
        messagebox.showinfo("Success", f"Message scheduled to {phone} at {hour}:{minute}")
    except Exception as e:
        messagebox.showerror("Error", str(e))

# GUI window
root = tk.Tk()
root.title("WhatsApp Message Automation")
root.geometry("500x500")
root.config(bg="#2C3E50")

# Title
title = tk.Label(root, text="WhatsApp Message Automation", font=("Helvetica", 18, "bold"), bg="#2C3E50", fg="#ECF0F1")
title.pack(pady=20)

# Phone number
phone_label = tk.Label(root, text="Enter Phone Number (+91XXXXXXXXXX):", font=("Helvetica", 12), bg="#2C3E50", fg="#ECF0F1")
phone_label.pack(pady=5)
phone_entry = tk.Entry(root, font=("Helvetica", 12), width=30)
phone_entry.pack(pady=5)

# Message
msg_label = tk.Label(root, text="Enter Your Message:", font=("Helvetica", 12), bg="#2C3E50", fg="#ECF0F1")
msg_label.pack(pady=5)
msg_entry = tk.Text(root, font=("Helvetica", 12), width=40, height=5)
msg_entry.pack(pady=5)

# Time inputs
time_frame = tk.Frame(root, bg="#2C3E50")
time_frame.pack(pady=10)

hour_label = tk.Label(time_frame, text="Hour (24h):", font=("Helvetica", 12), bg="#2C3E50", fg="#ECF0F1")
hour_label.grid(row=0, column=0, padx=5)
hour_entry = tk.Entry(time_frame, font=("Helvetica", 12), width=5)
hour_entry.grid(row=0, column=1, padx=5)

minute_label = tk.Label(time_frame, text="Minute:", font=("Helvetica", 12), bg="#2C3E50", fg="#ECF0F1")
minute_label.grid(row=0, column=2, padx=5)
minute_entry = tk.Entry(time_frame, font=("Helvetica", 12), width=5)
minute_entry.grid(row=0, column=3, padx=5)

# Send button
send_button = tk.Button(root, text="Send Message", font=("Helvetica", 14, "bold"), bg="#27AE60", fg="#ECF0F1", padx=10, pady=5, command=send_message)
send_button.pack(pady=20)

# Footer
footer = tk.Label(root, text="Powered by Python & PyWhatKit", font=("Helvetica", 10), bg="#2C3E50", fg="#BDC3C7")
footer.pack(side=tk.BOTTOM, pady=10)

root.mainloop()
