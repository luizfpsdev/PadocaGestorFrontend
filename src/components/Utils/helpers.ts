let _id = 1;
function uid() { return `id_${_id++}_${Math.random().toString(36).slice(2, 6)}`; }
function dAgo(n:any) { const d = new Date(); d.setDate(d.getDate() - n); return d; }


export { uid, dAgo };