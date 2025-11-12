const ICON_EDIT = "✏️";
const ICON_CONFIRM = "✅";

// Função para obter a lista existente do servidor via requisição GET
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

getList() // Carregamento inicial dos dados

// Função para colocar um item na lista do servidor via requisição POST
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Função para atualizar um item existente via requisição PATCH
const patchItem = async (id, inputProduct, inputQuantity, inputPrice) => {
  const url = "http://127.0.0.1:5000/produto";

  const formData = new FormData();

  formData.append('id', Number(id));
  formData.append('nome', inputProduct);
  formData.append('quantidade', Number(inputQuantity));
  formData.append('valor', Number(inputPrice));

  fetch(url, {
    method: "PATCH",
    body: formData
  })
  .then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });
};


// Função para criar um botão close para cada item da lista
const insertCloseButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

// Função para criar um botão edit para cada item da lista
const insertEditButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode(ICON_EDIT);
  span.className = "edit";
  span.appendChild(txt);
  parent.appendChild(span);
}

// Função para remover um item da lista de acordo com o click no botão close
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

// Função para editar um item da lista de acordo com o click no botão edit
const editElement = (table) => {
  let editButtons = document.getElementsByClassName("edit");

  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].onclick = function () {
      let row = this.parentElement.parentElement;
      let id = row.rowIndex;
  
      if (this.textContent === ICON_EDIT) {
        // Torna as células editáveis
        for (let j = 0; j < row.cells.length - 2; j++) {
          row.cells[j].contentEditable = true;
          row.cells[j].style.backgroundColor = "#ffffcc";
        }
  
        this.textContent = ICON_CONFIRM;
  
      } else {
        let nome = row.cells[0].textContent;
        let quantidade = row.cells[1].textContent;
        let valor = row.cells[2].textContent;
  
        if (confirm("Deseja salvar as alterações deste item?")) {
          patchItem(id, nome, quantidade, valor);
        }

        for (let j = 0; j < row.cells.length - 2; j++) {
          row.cells[j].contentEditable = false;
          row.cells[j].style.backgroundColor = "#ffffff";
        }

        this.textContent = ICON_EDIT;
      }
    };
  }  
};

// Função para deletar um item da lista do servidor via requisição DELETE
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Função para adicionar um novo item com nome, quantidade e valor 
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

// Função para inserir items na lista apresentada
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertEditButton(row.insertCell(-1))
  insertCloseButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  editElement(table)
  removeElement()
}