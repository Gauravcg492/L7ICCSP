import React, {Component} from 'react';
import SingleFileInfo from './singleFileInfo';


function FileInfoComponent() {
    const names = ['Bruce', 'Clark', 'Diana', 'Bruce']
  const persons = [
    {
      id: 1,
      name: 'Bruce',
      age: 30,
      skill: 'React'
    },
    {
      id: 2,
      name: 'Clark',
      age: 25,
      skill: 'Angular'
    },
    {
      id: 3,
      name: 'Diana',
      age: 28,
      skill: 'Vue'
    }
  ]
  const personList = persons.map(person => <SingleFileInfo key={person.id} file={person} />)
  return <div>{personList}</div>
}

export default FileInfoComponent;