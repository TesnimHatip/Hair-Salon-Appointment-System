const salons = [
  {
    id: 1,
    name: "Elit Güzellik Salonu",
    district: "Meram",
    city: "Konya",
    rating: "4.8",
    reviewCount: "120",
    phone: "0 (555) 123 45 67",
    address: "Alavardı Mah. 123. Sk. No:5 Meram / Konya",
    description:
      "Modern ekipmanlarımız ve uzman kadromuzla sizlere en iyi hizmeti sunuyoruz.",
    image: "images/salon1.jpg",
  },
  {
    id: 2,
    name: "Salon Vizyon",
    district: "Selçuklu",
    city: "Konya",
    rating: "4.6",
    reviewCount: "80",
    phone: "0 (555) 222 33 44",
    address: "Selçuklu Mah. Konya",
    description: "Profesyonel güzellik hizmetleri sunan modern salon.",
    image: "images/salon2.jpg",
  },
  {
    id: 3,
    name: "Güzellik Noktası",
    district: "Karatay",
    city: "Konya",
    rating: "4.7",
    reviewCount: "76",
    phone: "0 (555) 333 44 55",
    address: "Karatay Mah. Konya",
    description: "Güzellik ve bakım alanında kaliteli hizmet.",
    image: "images/salon3.jpg",
  },
  {
    id: 4,
    name: "Prestij Kuaför",
    district: "Meram",
    city: "Konya",
    rating: "4.9",
    reviewCount: "110",
    phone: "0 (555) 444 55 66",
    address: "Meram Mah. Konya",
    description: "Saç ve güzellik hizmetlerinde kaliteli hizmet.",
    image: "images/salon4.jpg",
  },
];
let currentSalonId = null;
async function showSalons() {
  const salonList = document.getElementById("salonList");

  if (!salonList) return;

  salonList.innerHTML = "";

  try {
    const response = await fetch("http://localhost:5000/api/salons");
    const salonsFromApi = await response.json();

    salonsFromApi.forEach(function (salon) {
      salonList.innerHTML += `
        <div class="col-md-4">
          <div class="card salon-card h-100 shadow-sm">
            <img src="${salon.image}" class="card-img-top salon-img" alt="${salon.name}">

            <div class="card-body">
              <h5 class="card-title">${salon.name}</h5>

              <p class="salon-location mb-2">
                <i class="fa-solid fa-location-dot"></i>
                ${salon.district}, ${salon.city}
              </p>

              <p class="salon-rating mb-3">
                <i class="fa-solid fa-star"></i>
                ${salon.rating} (${salon.reviewCount})
              </p>

              <a href="salon-detail.html?id=${salon._id}" class="btn btn-detail w-100">
                Detayları Gör
              </a>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    salonList.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          Salonlar yüklenirken hata oluştu.
        </div>
      </div>
    `;
  }
}

async function filterSalons() {
  const selectedDistrict = document.getElementById("districtFilter").value;
  const salonList = document.getElementById("salonList");

  salonList.innerHTML = "";

  try {
    const response = await fetch("http://localhost:5000/api/salons");
    const salonsFromApi = await response.json();

    let filteredSalons = salonsFromApi;

    if (selectedDistrict !== "Tümü") {
      filteredSalons = salonsFromApi.filter(function (salon) {
        return salon.district === selectedDistrict;
      });
    }

    filteredSalons.forEach(function (salon) {
      salonList.innerHTML += `
        <div class="col-md-4">
          <div class="card salon-card h-100 shadow-sm">
            <img src="${salon.image}" class="card-img-top salon-img" alt="${salon.name}">

            <div class="card-body">
              <h5 class="card-title">${salon.name}</h5>

              <p class="salon-location mb-2">
                <i class="fa-solid fa-location-dot"></i>
                ${salon.district}, ${salon.city}
              </p>

              <p class="salon-rating mb-3">
                <i class="fa-solid fa-star"></i>
                ${salon.rating} (${salon.reviewCount})
              </p>

              <a href="salon-detail.html?id=${salon._id}" class="btn btn-detail w-100">
                Detayları Gör
              </a>
            </div>
          </div>
        </div>
      `;
    });

    if (filteredSalons.length === 0) {
      salonList.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning">
            Bu ilçede salon bulunamadı.
          </div>
        </div>
      `;
    }
  } catch (error) {
    salonList.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          Filtreleme sırasında hata oluştu.
        </div>
      </div>
    `;
  }
}

async function showSalonDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const salonId = urlParams.get("id");

  try {
    const response = await fetch("http://localhost:5000/api/salons/" + salonId);
    const salon = await response.json();
    currentSalonId = salon._id;
    if (!response.ok) {
      document.body.innerHTML =
        "<h2 class='text-center mt-5'>Salon bulunamadı.</h2>";
      return;
    }

    document.getElementById("detailSalonNameBread").textContent = salon.name;
    document.getElementById("detailSalonName").textContent = salon.name;
    document.getElementById("detailSalonLocation").textContent =
      salon.district + ", " + salon.city;
    document.getElementById("detailSalonRating").textContent =
      salon.rating + " (" + salon.reviewCount + " Değerlendirme)";
    document.getElementById("detailSalonPhone").textContent = salon.phone;
    document.getElementById("detailSalonAddress").textContent = salon.address;
    document.getElementById("detailSalonDescription").textContent =
      salon.description;
    showSalonServicesInDetail(salon._id);
    showSalonReviews(salon._id);

    document.getElementById("detailMainImage").src = salon.image;

    document.getElementById("smallImg1").src = salon.image;
    document.getElementById("smallImg2").src = "images/salon1.jpg";
    document.getElementById("smallImg3").src = "images/salon2.jpg";
    document.getElementById("smallImg4").src = "images/salon3.jpg";

    const bookingButton = document.getElementById("bookingButton");

    bookingButton.href = "#";
    bookingButton.onclick = function () {
      goToBooking(salon._id);
    };
  } catch (error) {
    document.body.innerHTML =
      "<h2 class='text-center mt-5'>Salon detayı yüklenirken hata oluştu.</h2>";
  }
}

function changeDetailImage(imagePath) {
  document.getElementById("detailMainImage").src = imagePath;
}

let selectedBookingSalon = null;

async function showBookingPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const salonId = urlParams.get("id");

  try {
    const response = await fetch("http://localhost:5000/api/salons/" + salonId);
    const salon = await response.json();

    if (!response.ok) {
      document.body.innerHTML =
        "<h2 class='text-center mt-5'>Salon bulunamadı.</h2>";
      return;
    }

    selectedBookingSalon = salon;

    document.getElementById("bookingSalonImage").src = salon.image;
    document.getElementById("bookingSalonName").textContent = salon.name;
    document.getElementById("bookingSalonLocation").textContent =
      salon.district + ", " + salon.city;
    document.getElementById("bookingSalonPhone").textContent = salon.phone;
    showBookingServices(salon._id);
  } catch (error) {
    document.body.innerHTML =
      "<h2 class='text-center mt-5'>Randevu sayfası yüklenirken hata oluştu.</h2>";
  }
}

async function createAppointment() {
  const service = document.getElementById("serviceSelect").value;
  const date = document.getElementById("bookingDate").value;
  const time = document.getElementById("bookingTime").value;
  const note = document.getElementById("bookingNote").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Randevu almak için giriş yapmalısınız.");
    window.location.href = "login.html";
    return;
  }

  if (!selectedBookingSalon) {
    alert("Salon bilgisi yüklenemedi.");
    return;
  }

  if (service === "" || date === "" || time === "") {
    alert("Lütfen hizmet, tarih ve saat seçiniz.");
    return;
  }

  const appointmentData = {
    salonId: selectedBookingSalon._id,
    salonName: selectedBookingSalon.name,
    customerId: user.id,
    customerName: user.fullName,
    serviceName: service,
    date: date,
    time: time,
    note: note,
  };

  try {
    const response = await fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Randevu oluşturulurken hata oluştu.");
      return;
    }

    alert("Randevunuz başarıyla oluşturuldu.");
    window.location.href = "customer-dashboard.html";
  } catch (error) {
    alert("Backend bağlantı hatası.");
  }
}
async function showCustomerAppointments() {
  const tableBody = document.getElementById("appointmentsTableBody");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger py-4">
          Randevularınızı görmek için giriş yapmalısınız.
        </td>
      </tr>
    `;
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/appointments/customer/" + user.id,
    );
    const appointments = await response.json();

    if (appointments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted py-4">
            Henüz randevunuz bulunmamaktadır.
          </td>
        </tr>
      `;
      return;
    }

    appointments.forEach(function (appointment) {
      let statusClass = "status-pending";
      let statusIcon = "fa-clock";

      if (appointment.status === "Onaylandı") {
        statusClass = "status-approved";
        statusIcon = "fa-circle-check";
      }

      if (appointment.status === "Reddedildi") {
        statusClass = "status-rejected";
        statusIcon = "fa-circle-xmark";
      }

      tableBody.innerHTML += `
        <tr>
          <td>
            <i class="fa-solid fa-store text-purple me-2"></i>
            ${appointment.salonName}
          </td>

          <td>${appointment.serviceName}</td>

          <td>${appointment.date}</td>

          <td>${appointment.time}</td>

          <td>
            <span class="${statusClass}">
              <i class="fa-solid ${statusIcon} me-1"></i>
              ${appointment.status}
            </span>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger py-4">
          Randevular yüklenirken hata oluştu.
        </td>
      </tr>
    `;
  }
}
async function showOwnerAppointments() {
  const tableBody = document.getElementById("ownerAppointmentsTableBody");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  try {
    const response = await fetch("http://localhost:5000/api/appointments");
    const appointments = await response.json();

    if (appointments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            Henüz gelen randevu bulunmamaktadır.
          </td>
        </tr>
      `;
      return;
    }

    appointments.forEach(function (appointment) {
      let statusClass = "status-pending";
      let statusIcon = "fa-clock";

      if (appointment.status === "Onaylandı") {
        statusClass = "status-approved";
        statusIcon = "fa-circle-check";
      }

      if (appointment.status === "Reddedildi") {
        statusClass = "status-rejected";
        statusIcon = "fa-circle-xmark";
      }

      let actionButtons = `
        <button class="btn btn-success btn-sm me-1" onclick="updateAppointmentStatus('${appointment._id}', 'Onaylandı')">
          Kabul Et
        </button>

        <button class="btn btn-danger btn-sm" onclick="updateAppointmentStatus('${appointment._id}', 'Reddedildi')">
          Reddet
        </button>
      `;

      if (appointment.status !== "Beklemede") {
        actionButtons = `<span class="text-muted">İşlem yapıldı</span>`;
      }

      tableBody.innerHTML += `
        <tr>
          <td>${appointment.customerName || "Müşteri"}</td>
          <td>${appointment.serviceName}</td>
          <td>${appointment.date}</td>
          <td>${appointment.time}</td>
          <td>
            <span class="${statusClass}">
              <i class="fa-solid ${statusIcon} me-1"></i>
              ${appointment.status}
            </span>
          </td>
          <td>${actionButtons}</td>
        </tr>
      `;
    });
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger py-4">
          Randevular yüklenirken hata oluştu.
        </td>
      </tr>
    `;
  }
}

async function updateAppointmentStatus(appointmentId, newStatus) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/appointments/" + appointmentId + "/status",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      },
    );

    if (!response.ok) {
      alert("Randevu durumu güncellenemedi.");
      return;
    }

    alert("Randevu durumu güncellendi.");
    showOwnerAppointments();
  } catch (error) {
    alert("Backend bağlantı hatası.");
  }
}
async function showAdminDashboard() {
  const totalUsers = document.getElementById("totalUsers");
  const totalSalons = document.getElementById("totalSalons");
  const totalAppointments = document.getElementById("totalAppointments");
  const totalMessages = document.getElementById("totalMessages");

  const lastUsersList = document.getElementById("lastUsersList");
  const lastSalonsList = document.getElementById("lastSalonsList");
  const lastAppointmentsList = document.getElementById("lastAppointmentsList");
  const contactMessagesTableBody = document.getElementById(
    "contactMessagesTableBody",
  );

  if (!totalSalons || !totalAppointments) return;

  try {
    const usersResponse = await fetch("http://localhost:5000/api/auth/users");
    const users = await usersResponse.json();

    const salonsResponse = await fetch("http://localhost:5000/api/salons");
    const salons = await salonsResponse.json();

    const appointmentsResponse = await fetch(
      "http://localhost:5000/api/appointments",
    );
    const appointments = await appointmentsResponse.json();

    const messagesResponse = await fetch("http://localhost:5000/api/contact");
    const messages = await messagesResponse.json();

    totalUsers.textContent = users.length;
    totalSalons.textContent = salons.length;
    totalAppointments.textContent = appointments.length;

    if (totalMessages) {
      totalMessages.textContent = messages.length;
    }

    lastUsersList.innerHTML = "";

    users.slice(0, 3).forEach(function (user) {
      let roleText = "Müşteri";

      if (user.role === "owner") {
        roleText = "Salon Sahibi";
      }

      if (user.role === "admin") {
        roleText = "Admin";
      }

      lastUsersList.innerHTML += `
        <div class="d-flex justify-content-between border-bottom py-2">
          <span>${user.fullName}</span>
          <span class="text-muted">${roleText}</span>
        </div>
      `;
    });

    if (users.length === 0) {
      lastUsersList.innerHTML = `
        <p class="text-muted mb-0">Henüz kullanıcı bulunmamaktadır.</p>
      `;
    }

    lastSalonsList.innerHTML = "";

    salons.slice(0, 3).forEach(function (salon) {
      lastSalonsList.innerHTML += `
        <div class="d-flex justify-content-between border-bottom py-2">
          <span>${salon.name}</span>
          <span class="text-muted">${salon.district}</span>
        </div>
      `;
    });

    if (salons.length === 0) {
      lastSalonsList.innerHTML = `
        <p class="text-muted mb-0">Henüz salon bulunmamaktadır.</p>
      `;
    }

    lastAppointmentsList.innerHTML = "";

    appointments.slice(0, 3).forEach(function (appointment) {
      lastAppointmentsList.innerHTML += `
        <div class="d-flex justify-content-between border-bottom py-2 gap-3">
          <span>${appointment.salonName} - ${appointment.serviceName}</span>
          <span class="text-muted">${appointment.date}</span>
        </div>
      `;
    });

    if (appointments.length === 0) {
      lastAppointmentsList.innerHTML = `
        <p class="text-muted mb-0">Henüz randevu bulunmamaktadır.</p>
      `;
    }

    if (contactMessagesTableBody) {
      contactMessagesTableBody.innerHTML = "";

      if (messages.length === 0) {
        contactMessagesTableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted py-4">
              Henüz iletişim mesajı bulunmamaktadır.
            </td>
          </tr>
        `;
      } else {
        messages.slice(0, 5).forEach(function (message) {
          let statusClass = "status-pending";
          let statusIcon = "fa-envelope";

          if (message.status === "Okundu") {
            statusClass = "status-approved";
            statusIcon = "fa-circle-check";
          }

          let actionButton = `
    <button class="btn btn-success btn-sm" onclick="updateContactMessageStatus('${message._id}')">
      Okundu Yap
    </button>
  `;

          if (message.status === "Okundu") {
            actionButton = `<span class="text-muted">İşlem yapıldı</span>`;
          }

          contactMessagesTableBody.innerHTML += `
    <tr>
      <td>${message.name}</td>
      <td>${message.email}</td>
      <td>${message.subject}</td>
      <td>${message.message}</td>
      <td>
        <span class="${statusClass}">
          <i class="fa-solid ${statusIcon} me-1"></i>
          ${message.status}
        </span>
      </td>
      <td>${actionButton}</td>
    </tr>
  `;
        });
      }
    }
  } catch (error) {
    if (lastUsersList) {
      lastUsersList.innerHTML = `
        <p class="text-danger mb-0">Kullanıcılar yüklenemedi.</p>
      `;
    }

    if (lastSalonsList) {
      lastSalonsList.innerHTML = `
        <p class="text-danger mb-0">Salonlar yüklenemedi.</p>
      `;
    }

    if (lastAppointmentsList) {
      lastAppointmentsList.innerHTML = `
        <p class="text-danger mb-0">Randevular yüklenemedi.</p>
      `;
    }

    if (contactMessagesTableBody) {
      contactMessagesTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-danger py-4">
            Mesajlar yüklenemedi.
          </td>
        </tr>
      `;
    }
  }
}
function showLoggedUserName() {
  const userTextElements = document.querySelectorAll(".logged-user-name");

  if (userTextElements.length === 0) return;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    userTextElements.forEach(function (element) {
      element.textContent = "Kullanıcı";
    });
    return;
  }

  userTextElements.forEach(function (element) {
    element.textContent = user.fullName;
  });
}
function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "login.html";
}
function protectPage(allowedRoles) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    alert("Bu sayfaya erişmek için giriş yapmalısınız.");
    window.location.href = "login.html";
    return;
  }

  if (!allowedRoles.includes(user.role)) {
    alert("Bu sayfaya erişim yetkiniz yok.");

    if (user.role === "customer") {
      window.location.href = "customer-dashboard.html";
    } else if (user.role === "owner") {
      window.location.href = "owner-dashboard.html";
    } else if (user.role === "admin") {
      window.location.href = "admin-dashboard.html";
    }
  }
}
function goToBooking(salonId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    alert("Randevu almak için giriş yapmalısınız.");
    window.location.href = "login.html";
    return;
  }

  if (user.role !== "customer") {
    alert("Sadece müşteriler randevu alabilir.");
    return;
  }

  window.location.href = "booking.html?id=" + salonId;
}

async function showOwnerSalonInfo() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/salons/owner/" + user.id,
    );
    const salon = await response.json();

    if (!response.ok) {
      document.getElementById("ownerSalonName").textContent =
        "Salon bulunamadı";
      document.getElementById("ownerSalonLocation").textContent = "-";
      document.getElementById("ownerSalonPhone").textContent = "-";
      return;
    }

    ownerSalonId = salon._id;
    ownerSalonData = salon;

    document.getElementById("ownerSalonImage").src = salon.image;
    document.getElementById("ownerSalonName").textContent = salon.name;
    document.getElementById("ownerSalonLocation").textContent =
      salon.district + ", " + salon.city;
    document.getElementById("ownerSalonPhone").textContent = salon.phone;

    showOwnerAppointmentsBySalon(ownerSalonId);
    showOwnerServices(ownerSalonId);
  } catch (error) {
    document.getElementById("ownerSalonName").textContent =
      "Salon bilgisi yüklenemedi";
  }
}
async function showOwnerAppointmentsBySalon(salonId) {
  const tableBody = document.getElementById("ownerAppointmentsTableBody");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  try {
    const response = await fetch(
      "http://localhost:5000/api/appointments/salon/" + salonId,
    );
    const appointments = await response.json();

    if (appointments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            Bu salona ait randevu bulunmamaktadır.
          </td>
        </tr>
      `;
      return;
    }

    appointments.forEach(function (appointment) {
      let statusClass = "status-pending";
      let statusIcon = "fa-clock";

      if (appointment.status === "Onaylandı") {
        statusClass = "status-approved";
        statusIcon = "fa-circle-check";
      }

      if (appointment.status === "Reddedildi") {
        statusClass = "status-rejected";
        statusIcon = "fa-circle-xmark";
      }

      let actionButtons = `
        <button class="btn btn-success btn-sm me-1" onclick="updateAppointmentStatusForOwner('${appointment._id}')">
          Kabul Et
        </button>

        <button class="btn btn-danger btn-sm" onclick="rejectAppointmentStatusForOwner('${appointment._id}')">
          Reddet
        </button>
      `;

      if (appointment.status !== "Beklemede") {
        actionButtons = `<span class="text-muted">İşlem yapıldı</span>`;
      }

      tableBody.innerHTML += `
        <tr>
          <td>${appointment.customerName || "Müşteri"}</td>
          <td>${appointment.serviceName}</td>
          <td>${appointment.date}</td>
          <td>${appointment.time}</td>
          <td>
            <span class="${statusClass}">
              <i class="fa-solid ${statusIcon} me-1"></i>
              ${appointment.status}
            </span>
          </td>
          <td>${actionButtons}</td>
        </tr>
      `;
    });
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger py-4">
          Randevular yüklenirken hata oluştu.
        </td>
      </tr>
    `;
  }
}
async function updateAppointmentStatusForOwner(appointmentId) {
  await updateAppointmentStatus(appointmentId, "Onaylandı");

  if (ownerSalonId) {
    showOwnerAppointmentsBySalon(ownerSalonId);
  }
}

async function rejectAppointmentStatusForOwner(appointmentId) {
  await updateAppointmentStatus(appointmentId, "Reddedildi");

  if (ownerSalonId) {
    showOwnerAppointmentsBySalon(ownerSalonId);
  }
}
async function showOwnerServices(salonId) {
  const tableBody = document.getElementById("ownerServicesTableBody");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  try {
    const response = await fetch(
      "http://localhost:5000/api/services/salon/" + salonId,
    );
    const services = await response.json();

    if (services.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted py-4">
            Bu salona ait hizmet bulunmamaktadır.
          </td>
        </tr>
      `;
      return;
    }

    services.forEach(function (service) {
      tableBody.innerHTML += `
        <tr>
          <td>${service.name}</td>
          <td>${service.price} TL</td>
          <td>${service.duration} dk</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteOwnerService('${service._id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-danger py-4">
          Hizmetler yüklenirken hata oluştu.
        </td>
      </tr>
    `;
  }
}
async function addOwnerService() {
  const name = document.getElementById("newServiceName").value;
  const price = document.getElementById("newServicePrice").value;
  const duration = document.getElementById("newServiceDuration").value;

  if (!ownerSalonId) {
    alert("Salon bilgisi yüklenemedi.");
    return;
  }

  if (name === "" || price === "" || duration === "") {
    alert("Lütfen tüm alanları doldurunuz.");
    return;
  }

  const serviceData = {
    salonId: ownerSalonId,
    name: name,
    price: Number(price),
    duration: Number(duration),
  };

  try {
    const response = await fetch("http://localhost:5000/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Hizmet eklenirken hata oluştu.");
      return;
    }

    document.getElementById("newServiceName").value = "";
    document.getElementById("newServicePrice").value = "";
    document.getElementById("newServiceDuration").value = "";

    const modalElement = document.getElementById("addServiceModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    showOwnerServices(ownerSalonId);

    alert("Hizmet başarıyla eklendi.");
  } catch (error) {
    alert("Backend bağlantı hatası.");
  }
}
async function showSalonServicesInDetail(salonId) {
  const servicesList = document.getElementById("detailServicesList");

  if (!servicesList) return;

  servicesList.innerHTML = "";

  try {
    const response = await fetch(
      "http://localhost:5000/api/services/salon/" + salonId,
    );
    const services = await response.json();

    if (services.length === 0) {
      servicesList.innerHTML = `
        <p class="text-muted mb-0">Bu salona ait hizmet bulunmamaktadır.</p>
      `;
      return;
    }

    services.forEach(function (service) {
      servicesList.innerHTML += `
        <div class="service-row">
          <span>${service.name}</span>
          <strong>${service.price} TL</strong>
          <span>${service.duration} dk</span>
        </div>
      `;
    });
  } catch (error) {
    servicesList.innerHTML = `
      <p class="text-danger mb-0">Hizmetler yüklenirken hata oluştu.</p>
    `;
  }
}
async function showBookingServices(salonId) {
  const serviceSelect = document.getElementById("serviceSelect");

  if (!serviceSelect) return;

  serviceSelect.innerHTML = `
    <option value="">Hizmet seçiniz</option>
  `;

  try {
    const response = await fetch(
      "http://localhost:5000/api/services/salon/" + salonId,
    );
    const services = await response.json();

    services.forEach(function (service) {
      serviceSelect.innerHTML += `
        <option value="${service.name} - ${service.price} TL (${service.duration} dk)">
          ${service.name} - ${service.price} TL (${service.duration} dk)
        </option>
      `;
    });
  } catch (error) {
    serviceSelect.innerHTML = `
      <option value="">Hizmetler yüklenemedi</option>
    `;
  }
}
async function deleteOwnerService(serviceId) {
  const confirmDelete = confirm("Bu hizmeti silmek istediğinize emin misiniz?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      "http://localhost:5000/api/services/" + serviceId,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Hizmet silinirken hata oluştu.");
      return;
    }

    if (ownerSalonId) {
      showOwnerServices(ownerSalonId);
    }

    alert("Hizmet başarıyla silindi.");
  } catch (error) {
    alert("Backend bağlantı hatası.");
  }
}
let ownerSalonData = null;
function openEditSalonModal() {
  if (!ownerSalonData) {
    alert("Salon bilgisi henüz yüklenmedi.");
    return;
  }

  document.getElementById("editSalonName").value = ownerSalonData.name;
  document.getElementById("editSalonDistrict").value = ownerSalonData.district;
  document.getElementById("editSalonCity").value = ownerSalonData.city;
  document.getElementById("editSalonPhone").value = ownerSalonData.phone;
  document.getElementById("editSalonAddress").value = ownerSalonData.address;
  document.getElementById("editSalonDescription").value =
    ownerSalonData.description;
  document.getElementById("editSalonImage").value = ownerSalonData.image;

  const modalElement = document.getElementById("editSalonModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}
async function updateOwnerSalon() {
  if (!ownerSalonId) {
    alert("Salon bilgisi bulunamadı.");
    return;
  }

  const updatedSalonData = {
    name: document.getElementById("editSalonName").value,
    district: document.getElementById("editSalonDistrict").value,
    city: document.getElementById("editSalonCity").value,
    phone: document.getElementById("editSalonPhone").value,
    address: document.getElementById("editSalonAddress").value,
    description: document.getElementById("editSalonDescription").value,
    image: document.getElementById("editSalonImage").value,
  };

  if (
    updatedSalonData.name === "" ||
    updatedSalonData.district === "" ||
    updatedSalonData.city === "" ||
    updatedSalonData.phone === "" ||
    updatedSalonData.address === "" ||
    updatedSalonData.description === "" ||
    updatedSalonData.image === ""
  ) {
    alert("Lütfen tüm salon bilgilerini doldurunuz.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/salons/" + ownerSalonId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSalonData),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Salon güncellenirken hata oluştu.");
      return;
    }

    ownerSalonData = data;

    document.getElementById("ownerSalonImage").src = data.image;
    document.getElementById("ownerSalonName").textContent = data.name;
    document.getElementById("ownerSalonLocation").textContent =
      data.district + ", " + data.city;
    document.getElementById("ownerSalonPhone").textContent = data.phone;

    const modalElement = document.getElementById("editSalonModal");
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
      modal.hide();
    }

    alert("Salon bilgileri başarıyla güncellendi.");
  } catch (error) {
    alert("Backend bağlantı hatası.");
  }
}
let ownerSalonId = null;
async function updateContactMessageStatus(messageId) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/contact/" + messageId + "/status",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Okundu",
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Mesaj durumu güncellenemedi.");
      return;
    }

    alert("Mesaj okundu olarak işaretlendi.");
    showAdminDashboard();
  } catch (error) {
    alert("Backend bağlantı hatası.");
  }
}
function showCustomerProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  const fullNameInput = document.getElementById("profileFullName");
  const emailInput = document.getElementById("profileEmail");
  const roleInput = document.getElementById("profileRole");

  if (!fullNameInput || !emailInput || !roleInput) return;

  fullNameInput.value = user.fullName;
  emailInput.value = user.email;

  if (user.role === "customer") {
    roleInput.value = "Müşteri Hesabı";
  } else if (user.role === "owner") {
    roleInput.value = "Salon Sahibi Hesabı";
  } else if (user.role === "admin") {
    roleInput.value = "Yönetici Hesabı";
  }
}
async function showSalonReviews(salonId) {
  const reviewsList = document.getElementById("reviewsList");

  if (!reviewsList) return;

  reviewsList.innerHTML = "";

  try {
    const response = await fetch(
      "http://localhost:5000/api/reviews/salon/" + salonId,
    );
    const reviews = await response.json();

    if (reviews.length === 0) {
      reviewsList.innerHTML = `
        <p class="text-muted mb-0">Henüz değerlendirme yapılmamış.</p>
      `;
      return;
    }

    reviews.forEach(function (review) {
      let stars = "";

      for (let i = 1; i <= review.rating; i++) {
        stars += `<i class="fa-solid fa-star text-warning"></i>`;
      }

      reviewsList.innerHTML += `
  <div class="review-item">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div class="review-user">
        <div class="review-user-avatar">
          ${review.customerName.charAt(0).toUpperCase()}
        </div>
        <strong>${review.customerName}</strong>
      </div>

      <div class="review-stars">
        ${stars}
      </div>
    </div>

    <p class="review-comment">
      ${review.comment || "Yorum yazılmadı."}
    </p>
  </div>
`;
    });
  } catch (error) {
    reviewsList.innerHTML = `
      <p class="text-danger mb-0">Değerlendirmeler yüklenirken hata oluştu.</p>
    `;
  }
}

async function addReview() {
  const rating = document.getElementById("reviewRating").value;
  const comment = document.getElementById("reviewComment").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Değerlendirme yapmak için giriş yapmalısınız.");
    window.location.href = "login.html";
    return;
  }

  if (user.role !== "customer") {
    alert("Sadece müşteriler değerlendirme yapabilir.");
    return;
  }

  if (!currentSalonId) {
    alert("Salon bilgisi bulunamadı.");
    return;
  }

  if (rating === "") {
    alert("Lütfen puan seçiniz.");
    return;
  }

  const reviewData = {
    salonId: currentSalonId,
    customerId: user.id,
    customerName: user.fullName,
    rating: Number(rating),
    comment: comment,
  };

  try {
    const response = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Değerlendirme eklenirken hata oluştu.");
      return;
    }

    alert("Değerlendirmeniz başarıyla eklendi.");

    document.getElementById("reviewRating").value = "";
    document.getElementById("reviewComment").value = "";

    showSalonReviews(currentSalonId);
    showSalonDetail();
  } catch (error) {
    alert("Backend bağlantı hatası.");
  }
}
function toggleAiChat() {
  const chatBox = document.getElementById("aiChatBox");

  if (!chatBox) return;

  chatBox.classList.toggle("active");
}

async function sendAiMessage() {
  const input = document.getElementById("aiUserMessage");
  const messagesBox = document.getElementById("aiChatMessages");

  if (!input || !messagesBox) return;

  const userMessage = input.value.trim();

  if (userMessage === "") {
    alert("Lütfen bir mesaj yazınız.");
    return;
  }

  messagesBox.innerHTML += `
    <div class="ai-message user">
      ${userMessage}
    </div>
  `;

  input.value = "";

  messagesBox.innerHTML += `
    <div class="ai-message bot" id="aiLoadingMessage">
      Cevap hazırlanıyor...
    </div>
  `;

  messagesBox.scrollTop = messagesBox.scrollHeight;

  try {
    const response = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    const data = await response.json();

    const loadingMessage = document.getElementById("aiLoadingMessage");

    if (loadingMessage) {
      loadingMessage.remove();
    }

    if (!response.ok) {
      messagesBox.innerHTML += `
        <div class="ai-message bot">
          Bir hata oluştu. Lütfen tekrar deneyiniz.
        </div>
      `;
      return;
    }

    messagesBox.innerHTML += `
      <div class="ai-message bot">
        ${data.answer}
      </div>
    `;

    messagesBox.scrollTop = messagesBox.scrollHeight;
  } catch (error) {
    const loadingMessage = document.getElementById("aiLoadingMessage");

    if (loadingMessage) {
      loadingMessage.remove();
    }

    messagesBox.innerHTML += `
      <div class="ai-message bot">
        Backend bağlantı hatası.
      </div>
    `;
  }
}
