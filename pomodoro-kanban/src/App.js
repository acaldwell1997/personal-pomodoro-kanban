import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
//import uuid from 'uuid/v4';
import { v4 as uuid } from 'uuid';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

const itemsFromBackend = [
	{id: uuid(), content: 'First task', desc:'This is a test.'},
	{id: uuid(), content: 'Second task', desc:'Hope it works.'}
];
const columnsFromBackend = 
	{
		[uuid()]: {
			name: 'Backlog',
			items: itemsFromBackend
		}, 
		[uuid()]:
		{
			name: 'In Progress',
			items: []
		},
		[uuid()]:{
			name: 'Complete',
			items: []
			
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

function App() {
	const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div style={{display:'flex',justifyContent:'center', height:'100%'}}>
	  <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
	  	{Object.entries(columns).map(([id, column]) =>{
		 return(
		 <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		 <h2 class="mb-3"> {column.name} </h2>
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
			</div>
		 )})}
	  </DragDropContext>
    </div>
  );
}

export default App;
