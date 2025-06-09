// src/Settings/SettingsPage.jsx
import React from 'react';
import { Settings, Clock, Wrench } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Kelola pengaturan aplikasi Anda</p>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-6">
            <div className="relative">
              <Settings className="h-12 w-12 text-indigo-600" />
              <div className="absolute -top-1 -right-1">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Coming Soon
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Halaman pengaturan sedang dalam tahap pengembangan. 
            Fitur-fitur canggih untuk mengelola preferensi dan konfigurasi aplikasi akan segera hadir.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pengaturan Umum</h3>
              <p className="text-sm text-gray-600">
                Konfigurasi dasar aplikasi dan preferensi pengguna
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Wrench className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pengaturan Sistem</h3>
              <p className="text-sm text-gray-600">
                Konfigurasi lanjutan untuk administrator sistem
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalisasi</h3>
              <p className="text-sm text-gray-600">
                Sesuaikan tampilan dan pengalaman pengguna
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-12 p-6 bg-indigo-50 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">
              🚀 Estimasi Peluncuran
            </h3>
            <p className="text-indigo-700">
              Fitur pengaturan direncanakan akan tersedia dalam update mendatang.
              Pantau terus perkembangan aplikasi untuk mendapatkan fitur terbaru!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;