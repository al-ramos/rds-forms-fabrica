#!/bin/bash
# Sobe API e frontend localmente. Os caminhos apontavam para
# /c/GitHub/RDS.Forms.Fabrica, que nao existe desde o rebranding.
set -e
RAIZ="$(cd "$(dirname "$0")" && pwd)"

echo "🔨 Building solution..."
cd "$RAIZ"
dotnet build --no-restore 2>&1 | grep -E "error|succeeded|failed" || true

echo "🚀 Starting API..."
cd "$RAIZ/src/AMR.Forms.Fabrica.API"
dotnet run &

echo "⚛️  Starting Frontend..."
cd "$RAIZ/amr-forms-fabrica-web"
npm run dev &

echo "✅ Done! API: http://localhost:5186 | Frontend: http://localhost:5173"
wait
