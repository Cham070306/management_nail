import {env} from 'cloudflare:workers';
export type Role='owner'|'receptionist'|'employee';
export const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function access(userId:string,ownerId:string){if(userId===ownerId)return {role:'owner' as Role,employeeIndex:null as number|null};const member=await env.DB!.prepare('SELECT role,employee_index AS employeeIndex,employee_profile_id AS profileId FROM members WHERE owner_id=? AND user_id=?').bind(ownerId,userId).first<{role:Role,employeeIndex:number|null,profileId:string|null}>();if(!member)return null;if(member.role==='employee'){if(!member.profileId)return null;const row=await stored(ownerId);if(!row)return null;const index=JSON.parse(row.data).profiles.findIndex((p:any)=>p.id===member.profileId);if(index<0)return null;member.employeeIndex=index}return member}
export async function stored(ownerId:string){return await env.DB!.prepare('SELECT data,revision,updated_at FROM workspaces WHERE owner_id=?').bind(ownerId).first<{data:string,revision:number,updated_at:string}>()}
export function safeOrigin(request:Request){const o=request.headers.get('origin');return !o||o===new URL(request.url).origin}
export {operationalStateAllowed,appointmentLines,employeeView} from './permissions';
