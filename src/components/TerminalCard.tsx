import React from 'react'
import bio from '../data/bio.json'

function getAge(dob: string) {
  const b = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--
  return age
}

export default function TerminalCard(){
  const age = bio.dob ? getAge(bio.dob) : ''
  return (
    <div className="term mt-4">
      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
        <span style={{width:10,height:10,background:'#ff5f56',borderRadius:99}} />
        <span style={{width:10,height:10,background:'#ffbd2e',borderRadius:99}} />
        <span style={{width:10,height:10,background:'#27c93f',borderRadius:99}} />
      </div>
      <div style={{whiteSpace:'pre-wrap',color:'#cbd5e1'}}>
{`> whoami
${bio.profession || 'AI Engineer'} from ${bio.location || 'Vietnam'}
${bio.shortIntro}
${bio.learning || 'Learning Japanese and creating software'}
Age: ${age}`}
      </div>
    </div>
  )
}
