# CourseHub - Buoi 4 Notes

- Migration 001: enrollment_events audit table.
- Demo class: RACE-01, capacity = 1.
- POST /enrollments: lock class_sections bang FOR UPDATE.
- Concurrency test: 1 request 201, 1 request 409 (PASS).
- Performance data: 100000 rows, dataset=performance.
- Index: idx_enrollment_events_dataset_student_time.
- Query Performance:
  - Before Index: Seq Scan, Execution Time ~9.16ms.
  - After Index: Index Scan, Execution Time < 1ms.
