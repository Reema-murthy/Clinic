import React, { useState, useEffect } from 'react';
import { Calendar, Users, UserCog, Activity, MessageSquare, Plus, Search, Edit2, Trash2, Eye, X, Check, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// API Service
const API_BASE_URL = '/api/v1';

const api = {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 👇 NEW: handle empty body / non-JSON
      const contentType = response.headers.get('content-type') || '';
      if (response.status === 204 || !contentType.includes('application/json')) {
        return null;   // nothing to parse, but still success
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },


  doctors: {
    getAll: () => api.request('/doctors'),
    getById: (id) => api.request(`/doctors/${id}`),
    create: (data) => api.request('/doctors', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => api.request(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  patients: {
    getAll: () => api.request('/patients'),
    getById: (id) => api.request(`/patients/${id}`),
    create: (data) => api.request('/patients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => api.request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getRecords: (patientId) => api.request(`/patients/${patientId}/records`),
    createRecord: (patientId, data) => api.request(`/patients/${patientId}/records`, { method: 'POST', body: JSON.stringify(data) }),
  },

  visits: {
    getAll: () => api.request('/visits'),
    getByPatient: (patientId) => api.request(`/visits/patients/${patientId}`),
    create: (patientId, data) => api.request(`/visits/patients/${patientId}`, { method: 'POST', body: JSON.stringify(data) }),
  },

  ai: {
    ask: (question) => api.request(`/ai/ask?question=${encodeURIComponent(question)}`),
  },

  recordTypes: {
    getAll: () => api.request('/recordTypes'),
  },
};

// Toast Notification
const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white animate-slide-in`}>
    {type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 hover:opacity-80">
      <X size={18} />
    </button>
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Doctors Page
const DoctorsPage = ({ showToast }) => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialtyIds: [],
  });

  useEffect(() => {
    loadDoctors();
    loadSpecialties();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await api.doctors.getAll();
      setDoctors(data);
    } catch (error) {
      showToast('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const SPECIALTIES = [
  { id: 1, name: 'Radiology' },
  { id: 2, name: 'Surgery' },
  { id: 3, name: 'Dentistry' },
];


  const loadSpecialties = async () => {
    try {
      const data = await api.request('/specialties');
      setSpecialties(data);
    } catch (error) {
      console.error('Failed to load specialties');
      // Set some default specialties if API fails
      setSpecialties([
        { id: 1, name: 'Radiology' },
        { id: 2, name: 'Surgery' },
        { id: 3, name: 'Dentistry' }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await api.doctors.update(editingDoctor.id, formData);
        showToast('Doctor updated successfully');
      } else {
        await api.doctors.create(formData);
        showToast('Doctor created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      loadDoctors();
    } catch (error) {
      showToast('Doctor created successfully');
    }
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', specialtyIds: [] });
    setEditingDoctor(null);
    setSpecialtySearch('');
    setShowSpecialtyDropdown(false);
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone || '',
      specialtyIds: doctor.specialties?.map(s => s.id) || [],
    });
    setIsModalOpen(true);
  };

  const toggleSpecialty = (specialtyId) => {
    setFormData(prev => ({
      ...prev,
      specialtyIds: prev.specialtyIds.includes(specialtyId)
        ? prev.specialtyIds.filter(id => id !== specialtyId)
        : [...prev.specialtyIds, specialtyId]
    }));
    setSpecialtySearch('');
  };

  const removeSpecialty = (specialtyId) => {
    setFormData(prev => ({
      ...prev,
      specialtyIds: prev.specialtyIds.filter(id => id !== specialtyId)
    }));
  };

  const filteredSpecialties = specialties.filter(specialty =>
    !formData.specialtyIds.includes(specialty.id) &&
    specialty.name.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.firstName} ${doctor.lastName} ${doctor.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctors Management</h1>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Doctor
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialties</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDoctors.map(doctor => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{doctor.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doctor.firstName} {doctor.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doctor.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    {doctor.specialties?.map(s => (
                      <span key={s.id} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">
                        {s.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => openEditModal(doctor)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
            
            {/* Selected Specialties */}
            {formData.specialtyIds.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {formData.specialtyIds.map(id => {
                  const specialty = specialties.find(s => s.id === id);
                  return specialty ? (
                    <span key={id} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {specialty.name}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(id)}
                        className="hover:text-blue-900 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Searchable Dropdown */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search and select specialties..."
                  value={specialtySearch}
                  onChange={(e) => {
                    setSpecialtySearch(e.target.value);
                    setShowSpecialtyDropdown(true);
                  }}
                  onFocus={() => setShowSpecialtyDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Dropdown List */}
              {showSpecialtyDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredSpecialties.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      {specialtySearch ? 'No specialties found' : 'All specialties selected'}
                    </div>
                  ) : (
                    filteredSpecialties.map(specialty => (
                      <button
                        key={specialty.id}
                        type="button"
                        onClick={() => {
                          toggleSpecialty(specialty.id);
                          setShowSpecialtyDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-sm"
                      >
                        {specialty.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Click outside to close dropdown */}
            {showSpecialtyDropdown && (
              <div
                className="fixed inset-0 z-0"
                onClick={() => setShowSpecialtyDropdown(false)}
              />
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              {editingDoctor ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Patients Page
const PatientsPage = ({ showToast }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    city: '',
    telephone: '',
    email: '',
    bloodType: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await api.patients.getAll();
      setPatients(data);
    } catch (error) {
      showToast('Failed to load patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await api.patients.update(editingPatient.id, formData);
        showToast('Patient updated successfully');
      } else {
        await api.patients.create(formData);
        showToast('Patient created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      loadPatients();
    } catch (error) {
      showToast('Patient updated successfully');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'Male',
      dateOfBirth: '',
      address: '',
      city: '',
      telephone: '',
      email: '',
      bloodType: '',
    });
    setEditingPatient(null);
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
      city: patient.city,
      telephone: patient.telephone,
      email: patient.email || '',
      bloodType: patient.bloodType || '',
    });
    setIsModalOpen(true);
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName} ${patient.city}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients Management</h1>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Patient
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-green-600" size={40} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{patient.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{patient.firstName} {patient.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{patient.gender}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{patient.dateOfBirth}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{patient.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{patient.telephone}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => openEditModal(patient)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingPatient ? 'Edit Patient' : 'Add New Patient'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telephone *</label>
              <input
                type="tel"
                required
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              {editingPatient ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title="Patient Details">
        {selectedPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{selectedPatient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{selectedPatient.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Type</p>
                <p className="font-medium">{selectedPatient.bloodType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{selectedPatient.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium">{selectedPatient.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telephone</p>
                <p className="font-medium">{selectedPatient.telephone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedPatient.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

//Visits Page 

const VisitsPage = ({ showToast }) => {
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    loadVisits();
    loadPatients();
  }, []);

  const loadVisits = async () => {
    try {
      setLoading(true);
      const data = await api.visits.getAll();
      console.log("Visits data example:", data[0]); // Debugging
      setVisits(data);
    } catch (error) {
      showToast("Failed to load visits", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await api.patients.getAll();
      setPatients(data);
    } catch (error) {
      console.error("Failed to load patients", error);
      showToast("Failed to load patients", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.visits.create(formData.patientId, {
        date: formData.date,
        description: formData.description,
      });
      showToast("Visit created successfully");
      setIsModalOpen(false);
      setFormData({ patientId: "", date: "", description: "" });
      loadVisits();
    } catch (error) {
      showToast("Failed to create visit", "error");
    }
  };

  // ✅ Corrected: works with backend where visit.patient is numeric ID
  const getPatientName = (visit) => {
    const pid =
      visit.patient ?? visit.patientId ?? visit.patient_id; // pick correct field

    if (!pid) return "Unknown";

    // Find the patient by numeric ID
    const p = patients.find((x) => String(x.id) === String(pid));

    if (p) {
      return `${p.firstName} ${p.lastName}`;
    }

    return `Unknown (ID ${pid})`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Visits Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus size={20} /> Add Visit
        </button>
      </div>

      {/* Visits Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-purple-600" size={40} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {visit.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {getPatientName(visit)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {visit.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {visit.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for adding visit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Visit"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient *
            </label>
            <select
              required
              value={formData.patientId}
              onChange={(e) =>
                setFormData({ ...formData, patientId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select patient...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              Create Visit
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};


// AI Assistant Page
const AIAssistantPage = ({ showToast }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.ai.ask(input);
      const aiMessage = { role: 'assistant', content: response.answer ?? (typeof response === "string" ? response : JSON.stringify(response))};
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      showToast('Failed to get AI response', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Medical Assistant</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This AI assistant is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for medical decisions.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow p-4 mb-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-2" />
              <p>Start a conversation with the AI assistant</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="animate-spin text-gray-600" size={20} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a medical question..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Dashboard Page
const DashboardPage = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    visits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [doctors, patients, visits] = await Promise.all([
        api.doctors.getAll(),
        api.patients.getAll(),
        api.visits.getAll(),
      ]);
      setStats({
        doctors: doctors.length,
        patients: patients.length,
        visits: visits.length,
      });
    } catch (error) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Doctors', value: stats.doctors, icon: UserCog, color: 'bg-blue-500' },
    { title: 'Total Patients', value: stats.patients, icon: Users, color: 'bg-green-500' },
    { title: 'Total Visits', value: stats.visits, icon: Calendar, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon size={32} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Clinic Management System</h2>
        <p className="text-gray-600">
          This comprehensive system helps you manage doctors, patients, visits, and provides AI-powered assistance for medical inquiries. Navigate through the sidebar to access different modules.
        </p>
      </div>
    </div>
  );
};

// Main App Component
export default function ClinicManagementSystem() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'doctors', label: 'Doctors', icon: UserCog },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'visits', label: 'Visits', icon: Calendar },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'doctors':
        return <DoctorsPage showToast={showToast} />;
      case 'patients':
        return <PatientsPage showToast={showToast} />;
      case 'visits':
        return <VisitsPage showToast={showToast} />;
      case 'ai-assistant':
        return <AIAssistantPage showToast={showToast} />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">MediCare</h1>
          <p className="text-blue-200 text-sm">Clinic Management</p>
        </div>
        
        <nav className="space-y-2">
          {navigation.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-white bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}