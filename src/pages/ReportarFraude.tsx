import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import heroImage from "@/assets/hero-cyber.jpg";
import { API_BASE_URL } from "@/lib/config";

interface FraudForm {
  impostorDetails: string;
  contactInfo: string;
  comments: string;
}

type Status = "idle" | "loading" | "success" | "error";

const ReportarFraude = () => {
  const [form, setForm] = useState<FraudForm>({
    impostorDetails: "",
    contactInfo: "",
    comments: "",
  });
  const [errors, setErrors] = useState<Partial<FraudForm>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = (): boolean => {
    const newErrors: Partial<FraudForm> = {};
    if (!form.impostorDetails.trim())
      newErrors.impostorDetails = "Este campo es obligatorio.";
    if (!form.contactInfo.trim())
      newErrors.contactInfo = "Este campo es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FraudForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/fraud`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          impostorDetails: form.impostorDetails,
          contactInfo: form.contactInfo,
          comments: form.comments,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Error al enviar el reporte.");
      }

      setStatus("success");
      setForm({ impostorDetails: "", contactInfo: "", comments: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main
        id="main-content"
        className="relative flex-1 flex items-center justify-center overflow-hidden mt-20"
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        <section className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">
              Reportar fraude
            </h1>
            <p className="text-primary-foreground/75 mb-8">
              Complete el formulario con la información del caso. Todos los
              reportes son revisados por el equipo de LabCIBE-UNA.
            </p>

            {status === "success" && (
              <div className="flex items-center gap-3 bg-green-500/20 border border-green-400/40 rounded-xl px-4 py-3 mb-6 text-primary-foreground">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span>
                  Reporte enviado exitosamente. Gracias por su colaboración.{" "}
                  <Link to="/reportes" className="underline font-semibold">
                    Ver todos los reportes
                  </Link>
                </span>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-3 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 mb-6 text-primary-foreground">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 space-y-6 border border-white/20"
            >
              <div>
                <label
                  htmlFor="impostorDetails"
                  className="block text-sm font-semibold text-primary-foreground mb-1"
                >
                  Detalles del impostor <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="impostorDetails"
                  name="impostorDetails"
                  rows={3}
                  value={form.impostorDetails}
                  onChange={handleChange}
                  placeholder="Describa la persona o entidad que actuó como impostor..."
                  className="w-full rounded-xl bg-white/10 border border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
                />
                {errors.impostorDetails && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.impostorDetails}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contactInfo"
                  className="block text-sm font-semibold text-primary-foreground mb-1"
                >
                  Número, correo o usuario de contacto{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="contactInfo"
                  name="contactInfo"
                  type="text"
                  value={form.contactInfo}
                  onChange={handleChange}
                  placeholder="Ej: +506 8888-8888 / fraude@ejemplo.com / @usuario"
                  className="w-full rounded-xl bg-white/10 border border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                {errors.contactInfo && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.contactInfo}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="comments"
                  className="block text-sm font-semibold text-primary-foreground mb-1"
                >
                  Comentarios del caso
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows={4}
                  value={form.comments}
                  onChange={handleChange}
                  placeholder="Proporcione cualquier información adicional relevante..."
                  className="w-full rounded-xl bg-white/10 border border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-secondary-foreground rounded-full font-semibold transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar reporte
                    </>
                  )}
                </button>

                <Link
                  to="/reportes"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 rounded-full font-semibold transition-all duration-300"
                >
                  Ver reportes registrados
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReportarFraude;
