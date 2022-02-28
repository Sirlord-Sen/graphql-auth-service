import { UpdateInput } from "@user/inputs/user.input"
import { IProfile } from "@user/interfaces/profile.interface"
import { IUser } from "@user/interfaces/user.interface"


export default ((body: UpdateInput): {user: Partial<IUser>, profile: Partial<IProfile>} => {
    let k: keyof UpdateInput

    for (k in body) if(body[k] == "undefined" || body[k] == "null") body[k] = undefined

    let { username, name, email, password, bio, phone } = body
            
    const user = {username, name, email, password}
    const profile = { bio, phone }

    return { user, profile }
})