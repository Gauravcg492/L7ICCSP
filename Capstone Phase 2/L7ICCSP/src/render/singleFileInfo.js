import React from 'react';

function SingleFileInfo({file,key}){
   return( <div>
        <p key={key}>FileId: {file.id}, FileName: {file.name}</p>
    </div>)

}

export default SingleFileInfo