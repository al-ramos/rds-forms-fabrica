#!/bin/bash
echo "⏸️  Pausando serviços..."
aws ecs update-service --cluster amr-system --service amr-fabrica-api --desired-count 0
aws ecs update-service --cluster amr-system --service amr-fabrica-web --desired-count 0
echo "✅ Pausado."
