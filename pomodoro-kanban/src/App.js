import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
//import uuid from 'uuid/v4';
import { v4 as uuid } from 'uuid';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Pomodoro from './Pomodoro'
import 'bootstrap/dist/css/bootstrap.min.css';

const backlogItems = [
];
const progressItems = [
];
const completeItems = [
];
const columnsFromBackend = 
	{
		[uuid()]: {
			name: 'Backlog',
			items: backlogItems
		}, 
		[uuid()]:
		{
			name: 'In Progress',
			items: progressItems
		},
		[uuid()]:{
			name: 'Complete',
			items: completeItems
			
		}
	};

const onDragEnd = (result, columns, setColumns) => {
	if(!result.destination) return;
	const {source, destination} = result;
	console.log(columns)
	if(source.droppableId !== destination.droppableId){
		const sourceColumn = columns[source.droppableId];
		const destColumn = columns[destination.droppableId];
		const sourceItems = [...sourceColumn.items];
		const destItems = [...destColumn.items];
		const [removed] = sourceItems.splice(source.index, 1);
		destItems.splice(destination.index, 0, removed);
		setColumns({
			...columns,
			[source.droppableId]:{
			...sourceColumn,
			items:sourceItems
		},
				   [destination.droppableId]:{
				   ...destColumn,
				   items:destItems
				   }
		})

	}else{
			const column = columns[source.droppableId];
	const copiedItems = [...column.items];
	const [removed] = copiedItems.splice(source.index, 1);
	copiedItems.splice(destination.index, 0, removed);
	setColumns({
		...columns,
		[source.droppableId]: {
			...column,
			items: copiedItems
		}
	})
	}

}

function AddModal() {
  const [show, setShow] = useState(false);
  const [backlogItem, setBacklogItem] = useState(backlogItems);
  const [progressItem, setProgressItem] = useState(backlogItems);
  const [completeItem, setCompleteItem] = useState(backlogItems);
  const [columns, setColumns] = useState(columnsFromBackend);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const addTask = () => {
	  setShow(false);
	  let group = document.querySelector('select').value;
	  let content = document.querySelector('#content').value;
	  let desc = document.querySelector('#desc').value;
	  
	    switch(group) {
    case 'Backlog':	
      this.backlogItem.push({id: uuid(), content:content, desc:desc}); 
	  this.setBacklogItem({backlogItems: [...this.backlogItem, {id: uuid(), content:content, desc:desc}]});
    case 'In Progress':
      this.progressItem.push({id: uuid(), content:content, desc:desc});
	  this.setProgressItem({progressItems: [...this.progressItem, {id: uuid(), content:content, desc:desc}]});
	case 'Complete':
      this.setCompleteItem({completeItems: [...this.completeItem, {id: uuid(), content:content, desc:desc}]});		
  }
	  
  }


  return (
    <>
	  <Button variant="outline-secondary" onClick={handleShow}> Add Task </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
	  <Form>
  <Form.Group className="mb-3" controlId="content">
    <Form.Label>Title</Form.Label>
    <Form.Control type="text" placeholder="Task Title" />
  </Form.Group>

  <Form.Group className="mb-3" controlId="desc">
    <Form.Label>Description</Form.Label>
    <Form.Control as="textarea" rows={3} placeholder="Task Description" />
  </Form.Group>
<Form.Group className="mb-3">
    <Form.Label>Group</Form.Label>
    <Form.Select >
      <option>Backlog</option>
	  <option>In Progress</option>
	  <option>Complete</option>
    </Form.Select>
  </Form.Group>
</Form>
	  </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-primary" id="save" onClick={addTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
	  
  );
}

function App() {
	const [columns, setColumns] = useState(columnsFromBackend);
	
  return (
    <div style={{display:'flex',justifyContent:'center', height:'100%', marginTop: '5%'}}>
	  <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
	  	{Object.entries(columns).map(([id, column]) =>{
		 return(
		 <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				 
			 
		 <h2 className="mb-3"> {column.name} </h2>

			<div style={{margin: 8}}>
		 	<Droppable droppableId={id} key={id}>
	  			{(provided, snapshot)=>{
				 return (
				 <div 
				 {...provided.droppableProps}
				 ref={provided.innerRef}
					style={{
						background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
						padding: 4,
						width: 250,
						minHeight: 500
					}}
				 >
					 {column.items.map((item, index)=>
					  {
					  	return(
					  <Draggable key={item.id} draggableId={item.id} index={index}>
						  {(provided, snapshot)=>{
						   return(
						   	<div ref={provided.innerRef}
						  {...provided.draggableProps}
							{...provided.dragHandleProps}
style={{
	   userSelect: 'none',
	   margin: '5px',
	   ...provided.draggableProps.style
	  }}>
		  
		  <Card>
  <Card.Body>
    <Card.Title>{item.content}</Card.Title>
    <Card.Text>
      {item.desc}
    </Card.Text> 
  </Card.Body>
</Card>

</div>
						   )
						  }}
					  </Draggable>
					  )
					 })}
					 {provided.placeholder}
				 </div>
				 )
				}}
		 	</Droppable>
			</div>
	<div>
		  
<AddModal />
				
    </div>
			</div>
		 )})}
	  </DragDropContext>
<Pomodoro />
    </div>
  );
}

export default App;
