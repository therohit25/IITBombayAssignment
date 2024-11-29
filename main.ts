interface IAnimalSpeciesType {
  id?: number;
  species: string;
  name: string;
  size: number;
  image?: string;
  location: string;
}

const loadJSON = async (filePath: string): Promise<IAnimalSpeciesType[]> => {
  const response = await fetch(filePath);
  const data = await response.json();
  return data as IAnimalSpeciesType[];
};

class Animal {
  private animalTable: HTMLElement | null = null;
  private animalData: IAnimalSpeciesType[] = [];
  private species: string = "";
  private sortedBy: string = "";
  protected sortOptions: string[] = ["name", "size", "location"];
  protected nameStyleClasses = "text-capitalize";
  private dummyImages: string[] = [
    "https://media.istockphoto.com/id/108126645/photo/asiatic-lion.webp?a=1&b=1&s=612x612&w=0&k=20&c=eDEmzjnfzl7Hl5jI27uKacNTsQh693nXysZQXRWMxdg=",
    "https://media.istockphoto.com/id/171148547/photo/asiatic-lion.webp?a=1&b=1&s=612x612&w=0&k=20&c=D2CJKmvU4i7GT7jcOa9kTuntX0iWCuM6fZIp9UQIGMI=",
    "https://media.istockphoto.com/id/1136053333/photo/elephant-and-lion.webp?a=1&b=1&s=612x612&w=0&k=20&c=rGXhl00oROy53jzfH_yOelzPmlJBHkkNE8xvZ5BZPjg=",
  ];
  constructor(species: string) {
    this.species = species;
    loadJSON(`./data/${this.species}.json`).then((res) => {
      this.animalData = res;
      this.render();
    });
  }

  add(values: IAnimalSpeciesType) {
    this.animalData.push({
      ...values,
      id: Number(this.animalData[this.animalData.length - 1]?.id) + 1,
    });
    this.render();
  }
  remove(animalId: number) {
    this.animalData = this.animalData.filter((item) => item.id !== animalId);
    this.render();
  }

  update(animalId: number, values: IAnimalSpeciesType) {
    const resultArry: IAnimalSpeciesType[] = this.animalData.map((item) =>
      item.id !== animalId ? item : { ...item, ...values }
    );
    if (resultArry) {
      this.animalData = resultArry;
      this.render();
    }
  }

  sortBy(parmater: string) {
    switch (parmater) {
      case "id":
      case "size":
        this.animalData = this.animalData.sort(
          (a: IAnimalSpeciesType, b: IAnimalSpeciesType) =>
            (a[parmater] || 0) - (b[parmater] || 0)
        );
        return;
      default:
        this.animalData = this.animalData.sort(
          (a: IAnimalSpeciesType, b: IAnimalSpeciesType) =>
            String(a[parmater as keyof IAnimalSpeciesType]).localeCompare(
              String(b[parmater as keyof IAnimalSpeciesType])
            )
        );

        return;
    }
  }
  createForm(
    values: IAnimalSpeciesType = {
      id: 0,
      name: "",
      species: "",
      image: "",
      size: NaN,
      location: "",
    }
  ) {
    let edit: boolean = false;
    if (
      values.location?.trim() !== "" &&
      values.name?.trim() !== "" &&
      values.size > 0 &&
      values.species?.trim() !== ""
    ) {
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
        <input type="text" id="${
          this.species
        }-ip-name" placeholder="Name" value="${
        values.name
      }" class="form-control" required>
        <input type="text" id="${
          this.species
        }-ip-species" placeholder="Species" value="${
        values.species
      }" class="form-control" required>
        <input type="number" id="${
          this.species
        }-ip-size" placeholder="Size" value="${
        values.size
      }" class="form-control" max="100" min="1">
        <input type="text" id="${
          this.species
        }-ip-location" placeholder="Location" value="${
        values.location
      }" class="form-control" required>
     <select class="form-select" id="${this.species}-ip-image" required>
  <option value="${values.image}" selected>
    ${values.image ? values.image.split("/").pop() : "Select an image"}
  </option>
  ${this.dummyImages
    ?.map((item) => `<option value="${item}">${item.split("/").pop()}</option>`)
    .join("")}
</select>

        <button class="btn btn-primary form-control text-capitalize">${
          edit ? "Edit" : "Add"
        } ${this.species}</button>
    </form>`;

      const clone = form.cloneNode(true);
      form.parentNode?.replaceChild(clone, form);

      clone.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = (
          document.getElementById(this.species + "-ip-name") as HTMLInputElement
        )?.value;
        const species = (
          document.getElementById(
            this.species + "-ip-species"
          ) as HTMLInputElement
        )?.value;
        const size = (
          document.getElementById(this.species + "-ip-size") as HTMLInputElement
        )?.value;
        const location = (
          document.getElementById(
            this.species + "-ip-location"
          ) as HTMLInputElement
        )?.value;
        const image = (
          document.getElementById(
            this.species + "-ip-image"
          ) as HTMLInputElement
        )?.value;

        if (!name || !species || Number(size) < 0 || !location || !image) {
          const error = document.createElement("span");
          error.id = "species-form-error";
          error.className = "text-danger";
          document.body.appendChild(error);
          return;
        }
        if (edit) {
          this.update(Number(values?.id) || 1, {
            name,
            species,
            image,
            size: Number(size) || 1,
            location,
          });
        } else {
          this.add({ name, species, size: Number(size) || 1, location, image });
        }
        if (clone) {
          (clone as HTMLElement).remove();
        }
      });
    }
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }
  render() {
    this.animalTable = document.getElementById(`${this.species}Table`);

    if (!this.animalTable) {
      return;
    }

    if (!this.sortedBy || !this.sortOptions.includes(this.sortedBy)) {
      this.sortedBy = "name";
    }
    this.animalTable.innerHTML = `
    <div class="container">
      <h3 class="text-capitalize">${this.species} Table</h3>
      <div class="row mb-3">
        <div class="col-12">
          <select id='${
            this.species
          }-sortBy' class="form-select text-capitalize">
            <option value="" disabled>--Sort By--</option>
            ${this.sortOptions
              .map(
                (item) =>
                  `<option value="${item}" ${
                    item === this.sortedBy ? "selected" : ""
                  }>${item}</option>`
              )
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
          ${this.animalData
            ?.map(
              (item: IAnimalSpeciesType) => `
                <tr>
                <td class="d-flex flex-column">
                <p>Species: <span class='${this.nameStyleClasses}'>${
                item.species
              }</span></p>
                  <p>Name: <span class='${this.nameStyleClasses}'>${
                item.name
              }</span></p>
                  <p>Size: <span class='${this.nameStyleClasses}'>${
                item.size
              }ft</span></p>
                  <p>Location: <span class='${this.nameStyleClasses}'>${
                item.location
              }</span></p>
                 </td> 
                  <td><img src=${
                    item.image
                  } class="img-fluid w-100 h-25 imgClass" alt=${
                item.image
              } image></td>
                  <td>
                    <button class="btn btn-danger remove-btn" id='${
                      Number(item.id) || 1
                    }'>Remove</button>
                    <button edit-btn-id=${item.id} id=editForm-${
                item.name
              }-id class="btn btn-secondary edit-btn">Edit</button>
                  </td>
                </tr>`
            )
            .join("")}
          <tr>
            <td colspan="4" class="text-center">
              <button id=addForm-${
                this.species
              }-id class="btn btn-primary text-capitalize">Add ${
      this.species
    }</button>
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

    const addForm = this.animalTable.querySelector(
      `#addForm-${this.species}-id`
    );

    addForm?.addEventListener("click", () => {
      this.createForm();
    });

    const editForm = this.animalTable.querySelectorAll(".edit-btn");
    editForm?.forEach((item) => {
      item?.addEventListener("click", () => {
        const editBtnId = item.getAttribute("edit-btn-id");
        this.createForm(
          this.animalData.find((animal) => animal.id === Number(editBtnId) || 0)
        );
      });
    });

    const sortBy = document.getElementById(`${this.species}-sortBy`);
    if (sortBy) {
      sortBy.addEventListener("change", (e) => {
        const selectedValue = (e.target as HTMLSelectElement)?.value || "";
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
  constructor(species: string) {
    super(species);
    this.sortOptions = ["name", "size", "location"];
  }
}
class Dog extends Animal {
  constructor(species: string) {
    super(species);
    this.sortOptions = ["name", "location"];
    this.nameStyleClasses += " fw-bold";
  }
}
class Fish extends Animal {
  constructor(species: string) {
    super(species);
    this.sortOptions = ["size"];
    this.nameStyleClasses += " fw-bold fst-italic text-primary";
  }
}

const bigCats = new Cat("bigCats");
const dog = new Dog("dogs");
const bigFish = new Fish("bigFish");
