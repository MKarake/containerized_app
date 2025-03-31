document.addEventListener("DOMContentLoaded", () => {
    loadItems();
});

// Improved loading and error handling
async function loadItems() {
    const itemsList = document.getElementById("itemsList");
    itemsList.innerHTML = "<p>Loading items...</p>";

    try {
        const response = await fetch("http://localhost:8000/items/");

        if (!response.ok) throw new Error("Failed to fetch items.");

        const items = await response.json();
        itemsList.innerHTML = "";

        items.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span><strong>${item.name}</strong>: ${item.description}</span>
                <div>
                    <button onclick="editItem(${item.id}, '${item.name}', '${item.description}')">Edit</button>
                    <button onclick="deleteItem(${item.id})">Delete</button>
                </div>
            `;
            itemsList.appendChild(li);
        });
    } catch (error) {
        console.error("Error:", error);
        itemsList.innerHTML = "<p style='color: red;'>Error loading items.</p>";
    }
}

// CREATE ITEM
document.getElementById("itemForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const name = nameInput.value;
    const description = descriptionInput.value;

    try {
        const response = await fetch("http://localhost:8000/items/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description }),
        });

        if (!response.ok) throw new Error("Failed to add item.");

        nameInput.value = "";
        descriptionInput.value = "";
        loadItems();
    } catch (error) {
        console.error("Error:", error);
        alert("Error adding item!");
    }
});

// DELETE ITEM
async function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
        const response = await fetch(`http://localhost:8000/items/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete item.");

        loadItems();
    } catch (error) {
        console.error("Error:", error);
        alert("Error deleting item!");
    }
}

// EDIT ITEM
async function editItem(id, currentName, currentDescription) {
    const newName = prompt("Edit name:", currentName);
    const newDescription = prompt("Edit description:", currentDescription);

    if (newName !== null && newDescription !== null) {
        try {
            const response = await fetch(`http://localhost:8000/items/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, description: newDescription }),
            });

            if (!response.ok) throw new Error("Failed to update item.");

            loadItems();
        } catch (error) {
            console.error("Error:", error);
            alert("Error updating item!");
        }
    }
}
