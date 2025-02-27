import "./Login.css"
import LoginImg from "./../asserts/Login.jpg"
import { useState } from "react"
function Login(){
    const [login,setLogin]=useState(false);
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [Repassword,setRepassword]=useState('');

    const Shift=()=>{
        setLogin(!login);
    }
    return(
        <>
            <div className="content">
                <div className="page-1">
                    <img src={LoginImg} alt="" className="login-img" />
                </div>
                <div className="page-2">
                    {login ? 
                    <div>
                        <div className="form">
                            <h1 className="name">Login</h1>
                            <div className="fields">
                                <input type="text" name="username" id="username" placeholder="enter username" onChange={(e)=>setUsername(e.target.value)} value={username}/>
                                <input type="email" name="email" id="email" placeholder="enter email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
                                <input type="password" name="password" id="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
                            </div>
                            <div className="extra" onClick={Shift}>
                                <p>If don't have account ? Register</p>
                            </div>
                            <button className="login">Login</button>
                        </div>
                    </div>
                    :<div>
                        <div className="form">
                            <h1 className="name">Register</h1>
                            <div className="fields">
                                <input type="text" name="username" id="username" placeholder="enter username" onChange={(e)=>setUsername(e.target.value)} value={username}/>
                                <input type="email" name="email" id="email" placeholder="enter email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
                                <input type="password" name="password" id="password" placeholder="enter password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
                                <input type="password" name="password" id="password" placeholder="re enter password" onChange={(e)=>setRepassword(e.target.value)} value={Repassword}/>
                            </div>
                            <div className="extra" onClick={Shift}>
                                <p>If already have account ? Login</p>
                            </div>
                            <button className="login">Register</button>
                        </div>
                    </div>
                        
                    }
                
                </div>
                
            </div>
            
        </>
    )
}
export default Login