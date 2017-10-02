// button to add an item
// must generate id on entry
// should clear form after add





let todo = [];

let nextId         = 0,
    showingDeleted = false;





const el   = (name, opts = {}) => {
        const e = document.createElement(name);
        Object.keys(opts).map(key => e[key] = opts[key]);
        return e;
      },
      byId = id   => document.getElementById(id);





function writeControlCellContents(data, row, idx, controlCell) {

  if (row.complete) {
    const uncompleteBtn = el('a', {innerHTML: '🗿', onclick: () => { data[row.origIdx].complete = false; rerender(); }});
    controlCell.appendChild(uncompleteBtn);
  } else {
    const completeBtn = el('a', {innerHTML: '✅', onclick: () => { data[row.origIdx].complete = true; rerender(); }});
    controlCell.appendChild(completeBtn);
  }

  if (row.deleted) {
    const deleteBtn = el('a', {innerHTML: '♻', onclick: () => { data[row.origIdx].deleted = false; rerender(); }});
    controlCell.appendChild(deleteBtn);
  } else {
    const deleteBtn = el('a', {innerHTML: '❌', onclick: () => { data[row.origIdx].deleted = true; rerender(); }});
    controlCell.appendChild(deleteBtn);
  }

}





function renderTable(data) {

  const content     = byId('content');
  content.innerHTML = '';

  const table = el('table'),
        tbody = el('tbody');

  const headerRow     = el('tr');
  headerRow.innerHTML = '<th>id</th><th>topic</th><th>due</th><th></th>';

  tbody.appendChild(headerRow);

  data.map( (r,idx) => r.origIdx = idx);

  data.filter(r => (showingDeleted || (r.deleted !== true)) )
      .map( (row, idx) => {

    const trow        = el('tr'),
          idCell      = el('td'),
          nameCell    = el('td'),
          dueCell     = el('td');
          controlCell = el('td');

    idCell.innerHTML      = row.id;
    nameCell.innerHTML    = row.name;
    dueCell.innerHTML     = new Date(row.due).toLocaleString();
    writeControlCellContents(data, row, idx, controlCell);

    if (row.complete) { trow.classList.toggle('complete', true); }
    if (row.deleted)  { trow.classList.toggle('deleted',  true); }

    [idCell, nameCell, dueCell, controlCell].map(
      whichCell => trow.appendChild(whichCell)
    );

    tbody.appendChild(trow);

  } );

  table.append(tbody);
  content.appendChild(table);

  return table;

}





function addRow(topic, due) {

  if (byId('input_topic').value === '') {
    window.alert('Topic must not be blank');
    throw new Error('Topic must not be blank');
  }

  if (byId('input_due').value === '') {
    window.alert('Due date must be set');
    throw new Error('Due date must be set');
  }

  todo.push({

    id   : nextId++ ,
    name : topic    ,
    due  : due

  });

  byId('input_topic').value = '';
  byId('input_due').value   = '';

  rerender();

}





function rerender() {

  if (localStorage) {
    localStorage.setItem('data', JSON.stringify(todo));
  }

  renderTable(todo);

}





function HitShowDeleted() {

  showingDeleted = byId('showDeleted').checked;
  rerender();

}





function start() {

  todo = JSON.parse(localStorage.getItem('data') || '[]');

  byId('add_item').onclick     = AddRowFromForm;
  byId('showDeleted').onchange = HitShowDeleted;

  rerender();

}





function AddRowFromForm() {

  addRow(
    document.getElementById('input_topic').value,
    new Date(document.getElementById('input_due').value).getTime(),
  );

}





window.onload = start;
