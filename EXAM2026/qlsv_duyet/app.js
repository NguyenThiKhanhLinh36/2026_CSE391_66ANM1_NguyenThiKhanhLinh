$(function () {
  const dialog = document.getElementById("student-dialog");
  const STORAGE_KEY = "student_management_data";

  // Khởi tạo dữ liệu: Lấy từ LocalStorage, nếu không có thì lấy từ initialStudents (trong data.js)
  let students = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!students) {
    students = initialStudents;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  
  // --- Điều khiển Dialog ---
  $("#open-dialog").click(() => {
    $("#student-form")[0].reset();
    $("#edit-index").val("-1");
    $("#dialog-title").text("Thêm phòng");
    $(".error").hide();
    dialog.showModal();
  });

  $("#close-dialog").click(() => dialog.close());

  // --- Lưu & Validate ---
  $("#student-form").submit(function (e) {
    e.preventDefault();
    $(".error").hide();

    const data = {
      studentId: $("#studentId").val().trim(),
      fullName: $("#fullName").val().trim(),
      dob: $("#dob").val(),
      classRoom: $("#classRoom").val(),
      // gpa: $("#gpa").val(),
      email: $("#email").val().trim(),
      
    };

    let isValid = true;

    if (!/^SV\d{6}$/.test(data.studentId)) {
      $("#studentId").next().show();
      isValid = false;
    }
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(data.fullName) || data.fullName === "") {
      $("#fullName").next().show();
      isValid = false;
    }
    if (data.dob) {
      const age = new Date().getFullYear() - new Date(data.dob).getFullYear();
      if (age < 18) {
        $("#dob").next().show();
        isValid = false;
      }
    } else {
      $("#dob").next().show();
      isValid = false;
    }
    if (!data.classRoom) {
      $("#classRoom").next().show();
      isValid = false;
    }
    // 
    if (!data.email.endsWith("name@tenmien.com")) {
      $("#email").next().show();
      isValid = false;
    }
    

    if (isValid) {
      const editIdx = parseInt($("#edit-index").val());
      if (editIdx === -1) students.push(data);
      else students[editIdx] = data;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      dialog.close();
      renderTable();
    }
  });

  // --- Hàm toàn cục cho nút bấm ---
  window.deleteStudent = (index) => {
    if (confirm("Bạn có muốn xóa phòng này không?")) {
      students.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      renderTable();
    }
  };

  window.editStudent = (index) => {
    const s = students[index];
    $("#edit-index").val(index);
    $("#studentId").val(s.studentId);
    $("#fullName").val(s.fullName);
    $("#dob").val(s.dob);
    $("#classRoom").val(s.classRoom);
    // $("#gpa").val(s.gpa);
    $("#email").val(s.email);
    $("#password").val(s.password);
    $("#confirmPassword").val(s.password);
    $("#dialog-title").text("Sửa phòng");
    $(".error").hide();
    dialog.showModal();
  };

  renderTable();
});
