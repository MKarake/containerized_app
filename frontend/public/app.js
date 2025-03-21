document.addEventListener("DOMContentLoaded", () => {
    loadItems();
});

async function loadItems() {
    try {
        const response = await fetch("http://localhost:8000/items/");

        if (!response.ok) throw new Error("Failed to fetch items.");

        const items = await response.json();
        const itemsList = document.getElementById("itemsList");
        itemsList.innerHTML = "";

        items.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.id}. ${item.name} - ${item.description}</span>
                <button onclick="editItem(${item.id}, '${item.name}', '${item.description}')">Edit</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            `;
            itemsList.appendChild(li);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// ✅ CREATE ITEM
document.getElementById("itemForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;

    try {
        const response = await fetch("http://localhost:8000/items/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description }),
        });

        if (!response.ok) throw new Error("Failed to add item.");

        this.reset();
        loadItems();
    } catch (error) {
        console.error("Error:", error);
    }
});

// ✅ DELETE ITEM
async function deleteItem(id) {
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

// ✅ EDIT ITEM
async function editItem(id, currentName, currentDescription) {
    const newName = prompt("Enter new name:", currentName);
    const newDescription = prompt("Enter new description:", currentDescription);

    if (newName && newDescription) {
        try {
            const response = await fetch(`http://localhost:8000/items/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
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
