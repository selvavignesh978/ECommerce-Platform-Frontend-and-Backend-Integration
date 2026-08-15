import { useState } from "react";

const initialForm = { name: "", email: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.message.trim()) errs.message = "Message can't be empty";
    else if (form.message.trim().length < 10) errs.message = "Message should be at least 10 characters";
    return errs;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // In a full deployment this would POST to a /api/contact endpoint.
      setSubmitted(true);
      setForm(initialForm);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl font-semibold mb-2 text-center">Get in Touch</h1>
      <p className="text-center text-ink/50 mb-8 text-sm">Questions about an order or product? Send us a note.</p>

      {submitted && (
        <div className="bg-moss/10 text-moss border border-moss/30 rounded-xl px-4 py-3 mb-6 text-sm text-center">
          Thanks — your message has been sent!
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4">
        <div>
          <input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 ${errors.name ? "border-red-400" : "border-ink/15"}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 ${errors.email ? "border-red-400" : "border-ink/15"}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <textarea
            name="message"
            rows={5}
            placeholder="How can we help?"
            value={form.message}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-3 ${errors.message ? "border-red-400" : "border-ink/15"}`}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        <button type="submit" className="w-full bg-ink text-paper rounded-full py-3 hover:bg-plum transition-colors">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
