# CI/CD Pipeline Documentation - Sendit Web Admin

Dokumentasi ini menjelaskan setup Continuous Integration dan Continuous Deployment untuk aplikasi Sendit Web Admin.

## 🚀 Overview Pipeline

Pipeline CI/CD ini menggunakan GitHub Actions dengan beberapa tahapan:

1. **Test & Lint** - Menjalankan unit tests dan linting
2. **Build** - Build aplikasi React
3. **SonarCloud Analysis** - Analisis kualitas kode
4. **Security Scan** - Pemindaian keamanan dependencies
5. **Quality Gate** - Validasi akhir sebelum deployment

## 📋 Prerequisites

Sebelum menggunakan pipeline ini, pastikan Anda telah menyiapkan:

### GitHub Secrets
Tambahkan secrets berikut di repository GitHub Anda:

```
SONAR_TOKEN=your_sonarcloud_token
SONAR_PROJECT_KEY=your_project_key
SONAR_ORGANIZATION=your_organization_name
```

### SonarCloud Setup
1. Login ke [SonarCloud](https://sonarcloud.io/)
2. Import repository GitHub Anda
3. Dapatkan project key dan organization name
4. Generate token untuk GitHub Actions

## 🔧 Pipeline Configuration

### Trigger Events
Pipeline akan berjalan pada:
- Push ke branch: `master`, `main`, `develop`
- Pull Request events: `opened`, `synchronize`, `reopened`

### Jobs Detail

#### 1. Test & Lint Job
- Setup Node.js 18
- Install dependencies dengan `npm ci`
- Jalankan ESLint (jika tersedia)
- Jalankan unit tests dengan coverage
- Upload coverage ke Codecov

#### 2. Build Job
- Build aplikasi React
- Upload build artifacts
- Retention 7 hari untuk artifacts

#### 3. SonarCloud Analysis
- Analisis kualitas kode
- Upload coverage report
- Exclude test files dari coverage

#### 4. Security Scan
- npm audit untuk vulnerability check
- Deteksi high severity vulnerabilities

#### 5. Quality Gate
- Validasi hasil semua jobs
- Notifikasi status deployment readiness

## 📊 Test Coverage

Pipeline ini menggunakan Jest untuk testing dengan konfigurasi:
- Coverage report dalam format LCOV
- Exclude files: test files, setupTests.js, reportWebVitals.js
- Upload ke Codecov untuk tracking

## 🛡️ Security

### Dependency Scanning
- npm audit untuk known vulnerabilities
- Threshold: moderate level
- High severity vulnerabilities akan dilaporkan

### Code Quality
- SonarCloud analysis untuk:
  - Code smells
  - Bugs
  - Security hotspots
  - Duplications
  - Coverage metrics

## 🚂 Deployment

**Catatan**: Deployment menggunakan Railway (bukan GitHub Pages)

Pipeline ini tidak melakukan auto-deployment, tetapi:
1. Memvalidasi kode siap untuk production
2. Memberikan notifikasi "Ready for Railway deployment"
3. Railway akan melakukan deployment otomatis dari repository

## 📁 File Structure

```
.github/
└── workflows/
    └── build.yml          # Main CI/CD pipeline
sonar-project.properties   # SonarCloud configuration
src/
├── **/*.test.jsx          # Unit tests
└── **/*.jsx               # Source code
```

## 🔍 Monitoring & Debugging

### Logs
- Setiap job memiliki detailed logging
- Build artifacts tersimpan 7 hari
- Coverage reports di Codecov

### Quality Metrics
- SonarCloud dashboard untuk code quality
- Test coverage tracking
- Security vulnerability reports

### Troubleshooting

**Test Failures:**
```bash
# Local testing
npm test -- --coverage --watchAll=false
```

**Build Failures:**
```bash
# Local build
npm run build
```

**SonarCloud Issues:**
- Periksa SONAR_TOKEN validity
- Pastikan project key benar
- Check organization permissions

## 📈 Best Practices

1. **Testing**
   - Tulis unit tests untuk komponen baru
   - Maintain coverage > 80%
   - Test critical user flows

2. **Code Quality**
   - Follow ESLint rules
   - Address SonarCloud issues
   - Keep functions small and focused

3. **Security**
   - Regularly update dependencies
   - Review npm audit reports
   - Follow secure coding practices

4. **Performance**
   - Monitor bundle size
   - Optimize images and assets
   - Use React best practices

## 🤝 Contributing

1. Create feature branch dari `develop`
2. Tulis tests untuk fitur baru
3. Pastikan pipeline passes
4. Create Pull Request ke `develop`
5. Merge ke `master` untuk production

## 📞 Support

Jika mengalami issues dengan pipeline:
1. Check GitHub Actions logs
2. Review SonarCloud reports
3. Verify secrets configuration
4. Contact team lead untuk assistance

---

**Last Updated**: December 2024
**Pipeline Version**: 1.0
**Maintained by**: Development Team