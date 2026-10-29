-- Reconstructed from the application's documented call signatures.
-- These are new hosted-demo definitions, not recovered upstream SQL.
CREATE OR REPLACE PROCEDURE find_count_stats(INOUT student_count bigint, INOUT course_count bigint)
LANGUAGE plpgsql AS $$ BEGIN
 SELECT count(*) INTO student_count FROM users WHERE role IN ('student','class_representative','course_head');
 SELECT count(*) INTO course_count FROM courses;
END $$;
CREATE OR REPLACE PROCEDURE find_course_by_student_course(
 IN mode text, INOUT course_code varchar, INOUT course_name varchar, INOUT course_student_count bigint)
LANGUAGE plpgsql AS $$ BEGIN
 IF mode='min' THEN
  SELECT c.code,c.name,count(e."userId") INTO course_code,course_name,course_student_count
  FROM courses c LEFT JOIN "enrolledIn" e ON e."courseCode"=c.code GROUP BY c.code ORDER BY count(e."userId"),c.code LIMIT 1;
 ELSE
  SELECT c.code,c.name,count(e."userId") INTO course_code,course_name,course_student_count
  FROM courses c LEFT JOIN "enrolledIn" e ON e."courseCode"=c.code GROUP BY c.code ORDER BY count(e."userId") DESC,c.code LIMIT 1;
 END IF;
END $$;
CREATE OR REPLACE PROCEDURE student_per_year(
 INOUT year1 bigint,INOUT year2 bigint,INOUT year3 bigint,INOUT year4 bigint,INOUT year5 bigint)
LANGUAGE plpgsql AS $$ BEGIN
 SELECT count(*) FILTER (WHERE year='1'),count(*) FILTER (WHERE year='2'),count(*) FILTER (WHERE year='3'),
 count(*) FILTER (WHERE year='4'),count(*) FILTER (WHERE year='5')
 INTO year1,year2,year3,year4,year5 FROM users WHERE role IN ('student','class_representative','course_head');
END $$;
CREATE OR REPLACE PROCEDURE find_daily_users_average(INOUT avg_30_days double precision,INOUT avg_7_days double precision)
LANGUAGE plpgsql AS $$ BEGIN
 SELECT count(DISTINCT ("userId","sessionDate"))::double precision/30 INTO avg_30_days
 FROM sessions WHERE "sessionDate" BETWEEN current_date-29 AND current_date;
 SELECT count(DISTINCT ("userId","sessionDate"))::double precision/7 INTO avg_7_days
 FROM sessions WHERE "sessionDate" BETWEEN current_date-6 AND current_date;
END $$;
CREATE OR REPLACE PROCEDURE send_notifications_course(IN notification_id uuid,IN course_code text)
LANGUAGE plpgsql AS $$ BEGIN
 INSERT INTO received_notifications(notification_id,user_id)
 SELECT notification_id,recipients.id FROM (
  SELECT "userId" AS id FROM "enrolledIn" WHERE "courseCode"=course_code
  UNION SELECT "userId" FROM teaches WHERE "courseCode"=course_code
  UNION SELECT "userId" FROM manages WHERE "courseCode"=course_code
 ) recipients ON CONFLICT DO NOTHING;
END $$;
CREATE OR REPLACE PROCEDURE send_notifications_year(IN notification_id uuid,IN class_year text)
LANGUAGE plpgsql AS $$ BEGIN
 INSERT INTO received_notifications(notification_id,user_id)
 SELECT notification_id,id FROM users WHERE year::text=class_year ON CONFLICT DO NOTHING;
END $$;
