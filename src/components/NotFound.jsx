import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4">
      <h1 className="text-9xl font-bold mb-4">404</h1>
      <p className="text-2xl md:text-3xl mb-6">Oups ! Page non trouvée</p>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
