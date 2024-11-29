"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const loadJSON = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(filePath);
    const data = yield response.json();
    return data;
});
class Animal {
    constructor(species) {
        this.animalTable = null;
        this.animalData = [];
        this.species = "";
        this.sortedBy = "";
        this.sortOptions = ["name", "size", "location"];
        this.nameStyleClasses = "text-capitalize";
        this.dummyImages = [
            "https://media.istockphoto.com/id/108126645/photo/asiatic-lion.webp?a=1&b=1&s=612x612&w=0&k=20&c=eDEmzjnfzl7Hl5jI27uKacNTsQh693nXysZQXRWMxdg=",
            "https://media.istockphoto.com/id/171148547/photo/asiatic-lion.webp?a=1&b=1&s=612x612&w=0&k=20&c=D2CJKmvU4i7GT7jcOa9kTuntX0iWCuM6fZIp9UQIGMI=",
            "https://media.istockphoto.com/id/1136053333/photo/elephant-and-lion.webp?a=1&b=1&s=612x612&w=0&k=20&c=rGXhl00oROy53jzfH_yOelzPmlJBHkkNE8xvZ5BZPjg=",
        ];
        this.species = species;
        loadJSON(`./data/${this.species}.json`).then((res) => {
            this.animalData = res;
            this.render();
        });
    }
    add(values) {
        var _a;
        this.animalData.push(Object.assign(Object.assign({}, values), { id: Number((_a = this.animalData[this.animalData.length - 1]) === null || _a === void 0 ? void 0 : _a.id) + 1 }));
        this.render();
    }
    remove(animalId) {
        this.animalData = this.animalData.filter((item) => item.id !== animalId);
        this.render();
    }
    update(animalId, values) {
        const resultArry = this.animalData.map((item) => item.id !== animalId ? item : Object.assign(Object.assign({}, item), values));
        if (resultArry) {
            this.animalData = resultArry;
            this.render();
        }
    }
    sortBy(parmater) {
        console.log(parmater);
        switch (parmater) {
            case "id":
            case "size":
                this.animalData = this.animalData.sort((a, b) => (a[parmater] || 0) - (b[parmater] || 0));
                return;
            default:
                this.animalData = this.animalData.sort((a, b) => String(a[parmater]).localeCompare(String(b[parmater])));
                return;
        }
    }
    createForm(values = {
        id: 0,
        name: "",
        species: "",
        image: "",
        size: NaN,
        location: "",
    }) {
        var _a, _b, _c, _d, _e;
        let edit = false;
        if (((_a = values.location) === null || _a === void 0 ? void 0 : _a.trim()) !== "" &&
            ((_b = values.name) === null || _b === void 0 ? void 0 : _b.trim()) !== "" &&
            values.size > 0 &&
            ((_c = values.species) === null || _c === void 0 ? void 0 : _c.trim()) !== "") {
            edit = true;
        }
        let form = document.getElementById("species-form");
        if (!form) {
            form = document.createElement("form");
            form.id = "species-form";
            form.className = "w-50 mx-auto d-flex flex-column gap-1 my-2";
            document.body.appendChild(form);
        }
        if (form) {
            form.innerHTML = `<form>
      <h2 class="mx-auto">${edit ? "Edit" : "Add"} Form</h2>
        <input type="text" id="${this.species}-ip-name" placeholder="Name" value="${values.name}" class="form-control" required>
        <input type="text" id="${this.species}-ip-species" placeholder="Species" value="${values.species}" class="form-control" required>
        <input type="number" id="${this.species}-ip-size" placeholder="Size" value="${values.size}" class="form-control" max="100" min="1">
        <input type="text" id="${this.species}-ip-location" placeholder="Location" value="${values.location}" class="form-control" required>
     <select class="form-select" id="${this.species}-ip-image" required>
  <option value="${values.image}" selected>
    ${values.image ? values.image.split("/").pop() : "Select an image"}
  </option>
  ${(_d = this.dummyImages) === null || _d === void 0 ? void 0 : _d.map((item) => `<option value="${item}">${item.split("/").pop()}</option>`).join("")}
</select>

        <button class="btn btn-primary form-control text-capitalize">${edit ? "Edit" : "Add"} ${this.species}</button>
    </form>`;
            const clone = form.cloneNode(true);
            (_e = form.parentNode) === null || _e === void 0 ? void 0 : _e.replaceChild(clone, form);
            clone.addEventListener("submit", (e) => {
                var _a, _b, _c, _d, _e;
                e.preventDefault();
                const name = (_a = document.getElementById(this.species + "-ip-name")) === null || _a === void 0 ? void 0 : _a.value;
                const species = (_b = document.getElementById(this.species + "-ip-species")) === null || _b === void 0 ? void 0 : _b.value;
                const size = (_c = document.getElementById(this.species + "-ip-size")) === null || _c === void 0 ? void 0 : _c.value;
                const location = (_d = document.getElementById(this.species + "-ip-location")) === null || _d === void 0 ? void 0 : _d.value;
                const image = (_e = document.getElementById(this.species + "-ip-image")) === null || _e === void 0 ? void 0 : _e.value;
                if (!name || !species || Number(size) < 0 || !location || !image) {
                    const error = document.createElement("span");
                    error.id = "species-form-error";
                    error.className = "text-danger";
                    document.body.appendChild(error);
                    return;
                }
                if (edit) {
                    this.update(Number(values === null || values === void 0 ? void 0 : values.id) || 1, {
                        name,
                        species,
                        image,
                        size: Number(size) || 1,
                        location,
                    });
                }
                else {
                    this.add({ name, species, size: Number(size) || 1, location, image });
                }
                if (clone) {
                    clone.remove();
                }
            });
        }
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }
    render() {
        var _a;
        this.animalTable = document.getElementById(`${this.species}Table`);
        if (!this.animalTable) {
            return;
        }
        this.animalTable.innerHTML = `
    <div class="container">
      <h3 class="text-capitalize">${this.species} Table</h3>
      <div class="row mb-3">
        <div class="col-12">
          <select id='${this.species}-sortBy' class="form-select text-capitalize">
            <option value="" disabled selected>--Sort By--</option>
            ${this.sortOptions
            .map((item) => `<option value="${item}" ${item === this.sortedBy ? "selected" : ""}>${item}</option>`)
            .join("")}
          </select>
        </div>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Animal Details</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${(_a = this.animalData) === null || _a === void 0 ? void 0 : _a.map((item) => `
                <tr>
                <td class="d-flex flex-column">
                <p>Species: <span class='${this.nameStyleClasses}'>${item.species}</span></p>
                  <p>Name: <span class='${this.nameStyleClasses}'>${item.name}</span></p>
                  <p>Size: <span class='${this.nameStyleClasses}'>${item.size}ft</span></p>
                  <p>Location: <span class='${this.nameStyleClasses}'>${item.location}</span></p>
                 </td> 
                  <td><img src=${item.image} class="img-fluid w-100 h-25 imgClass" alt=${item.image} image></td>
                  <td>
                    <button class="btn btn-danger remove-btn" id='${Number(item.id) || 1}'>Remove</button>
                    <button edit-btn-id=${item.id} id=editForm-${item.name}-id class="btn btn-secondary edit-btn">Edit</button>
                  </td>
                </tr>`).join("")}
          <tr>
            <td colspan="4" class="text-center">
              <button id=addForm-${this.species}-id class="btn btn-primary text-capitalize">Add ${this.species}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
        const removeBtn = this.animalTable.querySelectorAll(".remove-btn");
        removeBtn.forEach((element) => {
            element.addEventListener("click", () => {
                this.remove(Number(element.id) || 1);
            });
        });
        const addForm = this.animalTable.querySelector(`#addForm-${this.species}-id`);
        addForm === null || addForm === void 0 ? void 0 : addForm.addEventListener("click", () => {
            this.createForm();
        });
        const editForm = this.animalTable.querySelectorAll(".edit-btn");
        editForm === null || editForm === void 0 ? void 0 : editForm.forEach((item) => {
            item === null || item === void 0 ? void 0 : item.addEventListener("click", () => {
                const editBtnId = item.getAttribute("edit-btn-id");
                this.createForm(this.animalData.find((animal) => animal.id === Number(editBtnId) || 0));
            });
        });
        const sortBy = document.getElementById(`${this.species}-sortBy`);
        if (sortBy) {
            sortBy.addEventListener("change", (e) => {
                var _a;
                console.log("CAlling");
                const selectedValue = ((_a = e.target) === null || _a === void 0 ? void 0 : _a.value) || "";
                console.log(selectedValue);
                if (selectedValue !== this.sortedBy) {
                    this.sortBy(selectedValue);
                    this.sortedBy = selectedValue;
                    this.render();
                }
            });
        }
    }
}
class Cat extends Animal {
    constructor(species) {
        super(species);
        this.sortOptions = ["name", "size", "location"];
    }
}
class Dog extends Animal {
    constructor(species) {
        super(species);
        this.sortOptions = ["name", "location"];
        this.nameStyleClasses += " fw-bold";
    }
}
class Fish extends Animal {
    constructor(species) {
        super(species);
        this.sortOptions = ["size"];
        this.nameStyleClasses += " fw-bold fst-italic text-primary";
    }
}
const bigCats = new Cat("bigCats");
const dog = new Dog("dogs");
const bigFish = new Fish("bigFish");
