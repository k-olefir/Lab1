/* jshint esversion: 6 */
document.addEventListener("DOMContentLoaded", () => {
    const burgerMenu = document.getElementById("burger-menu");
    const sidebar = document.querySelector(".sidebar");
    const notificationBell = document.querySelector(".notification");
    const notifBadge = document.querySelector(".notif-badge");
  
    const selectAllCheckbox = document.getElementById("select-all");
    const studentTableBody = document.querySelector("#students-table tbody");
    const addStudentBtn = document.getElementById("add-student");
    const studentModal = document.getElementById("student-modal");
    const closeModal = document.querySelector(".close");
    const cancelModal = document.getElementById("cancel");
    const studentForm = document.getElementById("student-form");
  
    const deleteModal = document.getElementById("delete-modal");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const deleteStudentNameSpan = document.getElementById("delete-student-name");

  
    let selectedRows = [];
  
    let editingRow = null; // Змінна для поточного редагованого рядка
  
    if (!window.location.pathname.includes("messages.html")) {
      notifBadge.style.display = "block";
  }
  
  if (burgerMenu && sidebar) {
    burgerMenu.addEventListener('click', () => {
      sidebar.classList.add('open');
      burgerMenu.style.display = 'none';
    });
  
    document.addEventListener('click', (e) => {
      const isClickInsideSidebar = sidebar.contains(e.target);
      const isBurgerClick = burgerMenu.contains(e.target);
  
      if (!isClickInsideSidebar && !isBurgerClick && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        burgerMenu.style.display = 'block';
      }
    });
  }
  
  if (notificationBell && notifBadge) {
    notificationBell.addEventListener("click", () => {
      window.location.href = "messages.html";
      notifBadge.style.display = "none";
    });
    notificationBell.addEventListener("mouseover", () => {
      const dropdown = document.querySelector(".notif-dropdown");
      if (dropdown) dropdown.style.display = "block";
    });
    notificationBell.addEventListener("mouseleave", () => {
      const dropdown = document.querySelector(".notif-dropdown");
      if (dropdown) dropdown.style.display = "none";
    });
    notificationBell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      notificationBell.classList.add("shake");
      setTimeout(() => {
        notificationBell.classList.remove("shake");
      }, 600);
      notifBadge.style.display = "block";
    });
  }
  
    if (window.location.pathname.includes("student.html")) {
      function showError(element, message) 
    {
      element.classList.add("invalid");
      const error = document.createElement("div");
      error.className = "error";
      error.textContent = message;
      element.insertAdjacentElement("afterend", error);
    }

    function isValidPastDate(dateString) {
        if (!dateString) return false;
    
        const selectedDate = new Date(dateString);
        if (isNaN(selectedDate.getTime())) return false; // Некоректна дата
    
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Початок сьогоднішнього дня

       // console.log("Selected Date:", selectedDate.toISOString());
        //console.log("Today:", today.toISOString());
    
        return selectedDate < today;
    }

    function getStudentsFromTable() {
      const rows = studentTableBody.querySelectorAll("tr");
      const students = [];
    
      rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        students.push({
          id: row.dataset.id || "",
          group: cells[1].textContent.trim(),
          firstName: cells[2].textContent.trim().split(" ")[0],
          lastName: cells[2].textContent.trim().split(" ").slice(1).join(" "),
          gender: cells[3].textContent.trim(),
          birthday: cells[4].textContent.trim(),
          status: cells[5].querySelector(".status").classList[1] || ""
        });
      });
    
      return students;
    }

    if (addStudentBtn && studentModal) {
      addStudentBtn.addEventListener("click", () => {
          document.getElementById("modal-title").textContent = "Add Student";
          studentForm.reset(); // очищення форми
          editingRow = null; // вказуємо, що додаємо, а не редагуємо
          studentModal.style.display = "block";
      });
  }
  
      // Відкриття модального вікна для редагування студента
      studentTableBody.addEventListener("click", (e) => {
          if (e.target.classList.contains("edit")) {
              const row = e.target.closest("tr");
  
              // Отримуємо дані з рядка
              const group = row.children[1].textContent.trim();
              const fullName = row.children[2].textContent.trim().split(" ");
              const firstName = fullName[0];
              const lastName = fullName.slice(1).join(" ");
              const gender = row.children[3].textContent.trim();
              const birthday = row.children[4].textContent.trim();
              const status = row.children[5].querySelector(".status").classList[1];
  
              // Заповнюємо форму
              document.getElementById("group").value = group;
              document.getElementById("first-name").value = firstName;
              document.getElementById("last-name").value = lastName;
              document.getElementById("gender").value = gender;
              document.getElementById("birthday").value = birthday;
              document.getElementById("status").value = status;
  
              const studentId = row.dataset.id;
              document.getElementById("student-id").value = studentId;
              editingRow = row; // Зберігаємо поточний рядок
              document.getElementById("modal-title").textContent = "Edit Student";
              studentModal.style.display = "block";
          }
      });
  
      // Збереження змін або додавання нового студента
      studentForm.addEventListener("submit", (e) => {
          e.preventDefault();
  
      const name_first = document.getElementById("first-name");
      const name_last = document.getElementById("last-name");
      const date_birth = document.getElementById("birthday");
  
      let isValid = true;
      const namePattern = /^[A-Za-zА-Яа-яІіЇїЄє']{2,30}$/;
      const PriseForPolytechnick = /^[A-Za-z0-9._-]+@lpnu\.ua$/;
  
      // Очистити попередні помилки
      [name_first, name_last, date_birth].forEach(input => {
          input.classList.remove("invalid");
          const error = input.nextElementSibling;
          if (error && error.classList.contains("error")) error.remove();
      });
  
      

      if(PriseForPolytechnick.test(name_first.value.trim())){
        alert("Hello Polytechnic");
      }
  
      if (!namePattern.test(name_last.value.trim())) {
          showError(name_last, "Invalid last name");
          isValid = false;
      }
  
      if (!date_birth.value) {
          showError(date_birth, "Please enter right birthday");
          isValid = false;
      }

    const dateValue = date_birth.value
    if (!isValidPastDate(dateValue)) {
        showError(date_birth, "Birthday must be in the past and correct.");
        isValid = false;
    }
  
      if (!isValid) return;
  
          const group = document.getElementById("group").value;
          const firstName = document.getElementById("first-name").value;
          const lastName = document.getElementById("last-name").value;
          const gender = document.getElementById("gender").value;
          const birthday = document.getElementById("birthday").value;
          const status = document.getElementById("status").value;
  
          if (editingRow) {
              // Оновлюємо існуючий рядок
              editingRow.children[1].textContent = group;
              editingRow.children[2].textContent = `${firstName} ${lastName}`;
              editingRow.children[3].textContent = gender;
              editingRow.children[4].textContent = birthday;
              editingRow.children[5].querySelector(".status").className = `status ${status}`;
          } else {
              // Додаємо нового студента
              const newId = Date.now();
              const newRowHTML = `

                <tr data-id="${newId}">
                  <td>
                      <label>
                          <input type="checkbox" class="row-checkbox"> Select
                      </label>
                  </td>
                  <td>${group}</td>
                  <td>${firstName} ${lastName}</td>
                  <td>${gender}</td>
                  <td>${birthday}</td>
                  <td><span class="status ${status}"></span></td>
                  <td>
                    <button class="edit">✏</button>
                    <button class="delete">❌</button>
                  </td>
                </tr>
              `;
              studentTableBody.insertAdjacentHTML("beforeend", newRowHTML);
          }
          const allStudents = getStudentsFromTable();
          console.log("Current students:", JSON.stringify(allStudents, null, 2));
          studentModal.style.display = "none";
          studentForm.reset();
          editingRow = null; // Скидаємо змінну
      });
  
      // Закриття модального вікна
      closeModal.addEventListener("click", () => {
          studentModal.style.display = "none";
          studentForm.reset();
          editingRow = null;
      });
  
      cancelModal.addEventListener("click", () => {
          studentModal.style.display = "none";
          studentForm.reset();
          editingRow = null;
      });
  
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", (e) => {
            const checked = e.target.checked;
            document.querySelectorAll(".row-checkbox").forEach(cb => {
                cb.checked = checked;
            });
        });
    }
  
    function updateSelectedRows() {
        selectedRows = Array.from(document.querySelectorAll(".row-checkbox:checked"))
            .map(cb => cb.closest("tr"));
    }
  
    studentTableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete")) {
            updateSelectedRows();
            const row = e.target.closest("tr");
  
            if (!row) return;
  
            const checkbox = row.querySelector(".row-checkbox");
  
            if (selectedRows.length === 0 || !checkbox.checked) {
                alert("To delete, you need to select the student in the checkbox!");
                return;
            }
  
            if (selectedRows.length === 1) {
                const studentName = row.querySelector("td:nth-child(3)").textContent.trim();
                deleteStudentNameSpan.textContent = `Are you sure you want to delete ${studentName}?`;
            } else {
                deleteStudentNameSpan.textContent = `Are you sure you want to delete ${selectedRows.length} students?`;
            }
  
            deleteModal.style.display = "block";
        }
    });
  
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            selectedRows.forEach(row => row.remove());
            selectedRows = [];
            deleteModal.style.display = "none";
        });
    }
  
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", () => {
            deleteModal.style.display = "none";
            selectedRows = [];
        });
    }
    }
  
  
   /* if (closeModal) {
        closeModal.addEventListener("click", () => {
            studentModal.style.display = "none";
        });
    }
  
    if (cancelModal) {
        cancelModal.addEventListener("click", () => {
            studentModal.style.display = "none";
        });
    }
  
    if (studentForm) {
      studentForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const group = document.getElementById("group").value;
          const firstName = document.getElementById("first-name").value;
          const lastName = document.getElementById("last-name").value;
          const gender = document.getElementById("gender").value;
          const birthday = document.getElementById("birthday").value;
          const status = document.getElementById("status").value;
          const newRowHTML = `
            <tr>
              <td>
              <label>
                 <input type="checkbox" class="row-checkbox">Select
              </label>
              </td>
              <td><b>${group}</b></td>
              <td><b>${firstName} ${lastName}</b></td>
              <td>${gender}</td>
              <td>${birthday}</td>
              <td><span class="status ${status}"></span></td>
              <td>
                <button class="edit">✏</button>
                <button class="delete">❌</button>
              </td>
            </tr>
          `;
          studentTableBody.insertAdjacentHTML("beforeend", newRowHTML);
          studentModal.style.display = "none";
          studentForm.reset();
      });
  }*/
  });
  