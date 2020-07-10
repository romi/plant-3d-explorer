import React from 'react'
import { getArgs } from '../helpers/functionFormatters'

const Tr = props =>
  <tr {...props} style={{ border: '1px solid gray' }} >
    {props.children}
  </tr>

const Th = props =>
  <th {...props} style={{ border: '1px solid gray', padding: 10 }} >
    {props.children}
  </th>

export default function FunctionTables ({ functions }) {
  return <div>
    {
      Object.keys(functions).map((d, i) => {
        const res = getArgs(functions[d])
        return res ? <div key={i}>
          <h3> {d} </h3>
          <h4> Parameters </h4>
          {
            (() => {
              console.log(res)
              return (<> {res && res.args && res.args.length && res.args[0][0]
                ? <table key={res[0]} style={{
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
                              <Th
                                dangerouslySetInnerHTML={{
                                  __html: d[0]
                                }} />
                              <Th dangerouslySetInnerHTML={{
                                __html: d[1] || ''
                              }} />
                              <Th dangerouslySetInnerHTML={{
                                __html: d[2] || ''
                              }} />
                            </Tr>
                          }) : null)
                      })()
                    }
                  </tbody>
                </table> : <p> None </p> }
                <h4> Description </h4>
                <p dangerouslySetInnerHTML={{
                  __html: (res && res.desc) ? res.desc : 'No description.'
                }} />
                </>)
            })()}
        </div> : null
      })
    }
  </div>
}
