-- Seed sample patients
INSERT INTO patients (first_name, last_name, gender, date_of_birth, address, city, telephone, email, blood_type)
VALUES
('John', 'Doe', 'Male', '1985-03-15', '123 Main St', 'Springfield', '5551234567', 'john.doe@example.com', 'O+'),
('Jane', 'Smith', 'Female', '1990-07-22', '456 Oak Ave', 'Shelbyville', '5559876543', 'jane.smith@example.com', 'A-'),
('Emily', 'Clark', 'Female', '1978-11-02', '789 Pine Rd', 'Ogdenville', '5555551212', 'emily.clark@example.com', 'B+');

-- Seed sample medical records
INSERT INTO medical_records (record_type, description, record_date, patient_id)
VALUES
('Consultation', 'Initial check-up and blood pressure measurement', '2024-05-01', 1),
('Prescription', 'Prescribed antihistamines for seasonal allergies', '2024-05-10', 1),
('Surgery', 'Appendectomy performed successfully', '2023-09-18', 2),
('Consultation', 'Follow-up after surgery; recovery progressing well', '2023-10-05', 2),
('Lab Test', 'Complete blood count with normal results', '2024-01-12', 3);


