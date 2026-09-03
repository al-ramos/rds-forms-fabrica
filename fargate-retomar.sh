#!/bin/bash
echo "▶️  Retomando serviços..."
aws ecs update-service --cluster amr-system --service amr-fabrica-api --desired-count 1
aws ecs update-service --cluster amr-system --service amr-fabrica-web --desired-count 1
echo "✅ Retomado. Aguarde ~60s e verifique o IP público."
