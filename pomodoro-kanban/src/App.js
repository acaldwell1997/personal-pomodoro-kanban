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
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const addTask = () => {
	  setShow(false);
	  let group = document.querySelector('select').value;
	  let content = document.querySelector('#content').value;
	  let desc = document.querySelector('#desc').value;
	  console.log(group)
	    switch(group) {
    case 'Backlog':
	  console.log(content)		
      backlogItems.push({id: uuid(), content:content, desc:desc}); 
	  this.setState({backlogItems: [...this.state.backlogItems, {id: uuid(), content:content, desc:desc}]});
    case 'In Progress':
      progressItems.push({id: uuid(), content:content, desc:desc});
	  this.setState({progressItems: [...this.state.progressItems, {id: uuid(), content:content, desc:desc}]});
	case 'Complete':
      completeItems.push({id: uuid(), content:content, desc:desc});	
      this.setState({completeItems: [...this.state.completeItems, {id: uuid(), content:content, desc:desc}]});
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
    <div style={{display:'flex',justifyContent:'center', height:'100%'}}>
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
