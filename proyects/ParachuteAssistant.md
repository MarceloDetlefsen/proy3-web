# Parachute S.A. Multi-Agent Assistant

Asistente conversacional para Parachute S.A. que responde FAQs empresariales y gestiona citas de paracaidismo con validación meteorológica en tiempo real. Implementa arquitecturas multiagente centralizada, jerárquica y descentralizada, combinando búsqueda semántica sobre PostgreSQL con pgvector, reglas deterministas de seguridad y evaluación automatizada con Promptfoo.

## Que resuelve

- Automatiza respuestas sobre requisitos, límites, políticas y operación del evento.
- Permite consultar condiciones meteorológicas y calendarizar citas únicamente cuando son seguras.
- Reduce respuestas inventadas mediante herramientas especializadas, validaciones deterministas y evidencia recuperada.
- Evalúa factualidad, latencia, ejecución de herramientas y persistencia de citas.

## Tecnologias principales

- Python y OpenAI Agents SDK para agentes, herramientas y handoffs.
- Groq API como modelo conversacional compatible con la API de OpenAI.
- PostgreSQL y pgvector para corpus, citas y búsquedas semánticas.
- Sentence Transformers para embeddings con all-MiniLM-L6-v2.
- Open-Meteo API, Promptfoo y Docker.

## Enfoque funcional

- Consulta de FAQs mediante búsqueda híbrida semántica y léxica.
- Validación meteorológica basada en viento, ráfagas, precipitación, nubosidad y visibilidad.
- Calendarización segura con límites de fecha y bloqueo de condiciones no aptas.
- Comparación de arquitecturas multiagente centralizada, jerárquica y descentralizada.
- Evaluaciones deterministas y con LLM judge mediante Promptfoo.

## Repo

https://github.com/MarceloDetlefsen/hdt6-ai
