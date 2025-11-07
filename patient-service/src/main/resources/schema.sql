-- Patients table matches com.example.clinic.patientservice.model.Patient
CREATE TABLE IF NOT EXISTS patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  date_of_birth DATE NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(80) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  email VARCHAR(120) NULL,
  blood_type VARCHAR(5) NULL,
  KEY idx_patients_last_name (last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medical records table matches com.example.clinic.patientservice.model.MedicalRecord
CREATE TABLE IF NOT EXISTS medical_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  record_type VARCHAR(60) NOT NULL,
  description TEXT NULL,
  record_date DATE NOT NULL,
  patient_id INT NOT NULL,
  KEY idx_medical_records_patient_id (patient_id),
  KEY idx_medical_records_record_date (record_date),
  CONSTRAINT fk_medical_records_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

