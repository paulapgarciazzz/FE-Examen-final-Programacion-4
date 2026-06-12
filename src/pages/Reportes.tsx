import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, ClipboardList } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import heroImage from "@/assets/hero-cyber.jpg";
import { API_BASE_URL } from "@/lib/config";

interface FraudReport {
  id: number;
  impostorDetails: string;
  contactInfo: string;
  comments: string;
  createdAt: string;
}

const Reportes = () => {
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/fraud`);
        if (!res.ok) throw new Error("No se pudieron cargar los reportes.");
        const data: FraudReport[] = await res.json();
        setReports(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main
        id="main-content"
        className="relative flex-1 overflow-hidden mt-20"
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        <section className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/reportar-estafa"
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Reportar un fraude
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <ClipboardList className="w-8 h-8 text-primary-foreground" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                  Reportes registrados
                </h1>
                <p className="text-primary-foreground/70 text-sm mt-1">
                  Listado de reportes de fraude recibidos.
                </p>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20 text-primary-foreground/70">
                <span className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
                Cargando reportes...
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-primary-foreground">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                {error}
              </div>
            )}

            {!loading && !error && reports.length === 0 && (
              <div className="text-center py-20 text-primary-foreground/60">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="text-lg">No hay reportes registrados aún.</p>
                <Link
                  to="/reportar-estafa"
                  className="mt-4 inline-block text-primary-foreground underline"
                >
                  Sé el primero en reportar
                </Link>
              </div>
            )}

            {!loading && !error && reports.length > 0 && (
              <div className="space-y-4">
                {reports.map((r) => (
                  <article
                    key={r.id}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="text-xs font-mono bg-white/10 text-primary-foreground/70 px-2 py-1 rounded-md">
                        #{r.id}
                      </span>
                      <span className="text-xs text-primary-foreground/50">
                        {formatDate(r.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50 mb-1">
                          Detalles del impostor
                        </p>
                        <p className="text-primary-foreground/90 text-sm leading-relaxed">
                          {r.impostorDetails}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50 mb-1">
                          Contacto
                        </p>
                        <p className="text-primary-foreground/90 text-sm">
                          {r.contactInfo}
                        </p>
                      </div>

                      {r.comments && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50 mb-1">
                            Comentarios
                          </p>
                          <p className="text-primary-foreground/80 text-sm leading-relaxed">
                            {r.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Reportes;
