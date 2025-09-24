INSERT IGNORE INTO doctors VALUES (1, 'James', 'Carter');
INSERT IGNORE INTO doctors VALUES (2, 'Helen', 'Leary');
INSERT IGNORE INTO doctors VALUES (3, 'Linda', 'Douglas');
INSERT IGNORE INTO doctors VALUES (4, 'Rafael', 'Ortega');
INSERT IGNORE INTO doctors VALUES (5, 'Henry', 'Stevens');
INSERT IGNORE INTO doctors VALUES (6, 'Sharon', 'Jenkins');

INSERT IGNORE INTO specialties VALUES (1, 'radiology');
INSERT IGNORE INTO specialties VALUES (2, 'surgery');
INSERT IGNORE INTO specialties VALUES (3, 'dentistry');

INSERT IGNORE INTO doctor_specialties VALUES (2, 1);
INSERT IGNORE INTO doctor_specialties VALUES (3, 2);
INSERT IGNORE INTO doctor_specialties VALUES (3, 3);
INSERT IGNORE INTO doctor_specialties VALUES (4, 2);
INSERT IGNORE INTO doctor_specialties VALUES (5, 1);
