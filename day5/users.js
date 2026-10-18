

const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const status = document.getElementById("status");
const usersList = document.getElementById("users-list");

let allUsers = [];





function renderUsers(list) {
  usersList.replaceChildren();

  list.forEach(function (user) {
    const li = document.createElement("li");

    const details = document.createElement("p");
    details.textContent =
      "Name: " +
      user.name +
      " | Email: " +
      user.email +
      " | City: " +
      user.address.city +
      " | Company: " +
      user.company.name;

    li.appendChild(details);
    usersList.appendChild(li);
  });
}








async function loadUsers() {
  loadButton.disabled = true;
  status.textContent = "Loading users...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Failed to load users.");
    }

    allUsers = await response.json();

    renderUsers(allUsers);
    status.textContent = "Users loaded successfully!";
  } catch (error) {
    status.textContent = "Error loading users. Please try again.";
  } finally {
    loadButton.disabled = false;
  }
}





loadButton.addEventListener("click", loadUsers);





filterInput.addEventListener("input", function () {
  const searchText = filterInput.value.toLowerCase();

  const filteredUsers = allUsers.filter(function (user) {
    return user.name.toLowerCase().includes(searchText);
  });

  renderUsers(filteredUsers);

  if (filteredUsers.length === 0 && allUsers.length > 0) {
    status.textContent = "No users match your filter.";
  } else if (allUsers.length > 0) {
    status.textContent = "Users loaded successfully!";
  }
});
