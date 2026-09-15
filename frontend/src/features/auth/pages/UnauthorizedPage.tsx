import { Link } from "react-router";

import { appPaths } from "../../../app/router/paths";
import { Card } from "../../../shared/components/ui";

function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Acesso negado</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Não tem acesso a esta página com a vista atual.
        </p>

        <div className="mt-6">
          <Link
            to={appPaths.calendar}
            className="text-sm font-medium text-sky-600 transition hover:text-sky-700"
          >
            Ir para Calendário
          </Link>
        </div>
      </Card>
    </div>
  );
}

export { UnauthorizedPage };
