import React from 'react'
import { getArgs } from '../helpers/functionFormatters'

const Tr = props =>
  <tr style={{ border: '1px solid black' }} >{props.children}</tr>

const Th = props =>
  <th style={{ border: '1px solid black', padding: 10 }} >{props.children}</th>

export default function FunctionTables ({ functions }) {
  return <div>
    {
      Object.keys(functions).map((d, i) => {
        const res = getArgs(functions[d])
        return <div key={i}>
          <h3> {d} </h3>
          <h4> Parameters </h4>
          {
            (() => {
              return (<> {res && res.args && res.args.length && res.args[1]
                ? <table key={res[0]} style={{
                  border: '1px solid black',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <Tr>
                      <Th> name </Th>
                      <Th> default value </Th>
                      <Th> description </Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {
                      (() => {
                        return (Array.isArray(res.args)
                          ? res.args.map((d) => {
                            return <Tr key={d[0]}>
                              <Th> {d[0]} </Th>
                              <Th> {d[1] || 'None'} </Th>
                              <Th> {d[2] || 'None'} </Th>
                            </Tr>
                          }) : null)
                      })()
                    }
                  </tbody>
                </table> : <p> None </p> }
                <h4> Description </h4>
                <p>
                  {(res && res.desc) ? res.desc : 'No description.'}
                </p>
                </>)
            })()}
        </div>
      })
    }
  </div>
}
