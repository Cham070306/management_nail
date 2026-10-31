window.tiemContext=new URLSearchParams(location.search).get('workspace')||'';
window.workspaceApi='/api/workspace'+(window.tiemContext?'?workspace='+encodeURIComponent(window.tiemContext):'');
window.workspaceStorageKey='tiem-workspace-v2'+(window.tiemContext?':'+window.tiemContext:'');
window.workspaceCloudKey='tiem-cloud-enabled'+(window.tiemContext?':'+window.tiemContext:'');
window.workspaceHadLocal=!!localStorage.getItem(window.workspaceStorageKey);

if(window.tiemContext){const guard=document.createElement('style');guard.id='sharedLoading';guard.textContent='body>aside,body>main{visibility:hidden!important}';document.head.append(guard)}
