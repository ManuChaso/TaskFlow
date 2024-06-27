import FetchApi from "./api-fetch";
import notification from "./notification";

export default async function exportProject(projectId){
    try{
        const res = await FetchApi('GET', `get-project?projectId=${projectId}`);

        if(res.success){
            const project = res.project;
            const projectData = {
                name: project.name,
                description: project.description,
                cards: project.cards.map(card => ({
                    name: card.name,
                    background: card.background,
                    textColor: card.textColor,
                    tasks: card.tasks.map(task => ({
                        name: task.name,
                        state: task.state
                    }))
                }))
            }

            const blob = new Blob([JSON.stringify(projectData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${res.project.name}.taskflow`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);
        }else{
            notification('Error exporting project, try again later', false, 'error');
            console.log(res);
        }
    } catch(err){
        console.log('Error exporting project: ',err);
    }
}