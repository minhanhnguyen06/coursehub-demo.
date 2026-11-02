
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, student_id, class_section_id, event_type, occurred_at
FROM enrollment_events
WHERE dataset = 'performance'
  AND class_section_id = 'WEB-01'
  AND event_type = 'CREATED'
  AND occurred_at >= TIMESTAMP '2025-06-01 00:00:00'
ORDER BY occurred_at DESC
LIMIT 50;


CREATE INDEX IF NOT EXISTS idx_enrollment_events_class_type_time
ON enrollment_events (class_section_id, event_type, occurred_at DESC);

ANALYZE enrollment_events;

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, student_id, class_section_id, event_type, occurred_at
FROM enrollment_events
WHERE dataset = 'performance'
  AND class_section_id = 'WEB-01'
  AND event_type = 'CREATED'
  AND occurred_at >= TIMESTAMP '2025-06-01 00:00:00'
ORDER BY occurred_at DESC
LIMIT 50;