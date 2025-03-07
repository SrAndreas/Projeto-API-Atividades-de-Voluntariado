// Função para carregar atividades
async function loadActivities() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa fazer login para ver as atividades.');
            window.location.href = 'login.html'; // Redireciona para a página de login
            return;
        }

        const response = await fetch('/activities', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token JWT
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar atividades');
        }

        const data = await response.json();

        const activitiesDiv = document.getElementById('activities');
        activitiesDiv.innerHTML = '';

        data.forEach(activity => {
            activitiesDiv.innerHTML += `
                <div class="activity">
                    <h2>${activity.title}</h2>
                    <p>${activity.description}</p>
                    <p><strong>Data:</strong> ${activity.date}</p>
                    <p><strong>Local:</strong> ${activity.location}</p>
                    <p><strong>Vagas restantes:</strong> ${activity.maxParticipants - (activity.participants ? activity.participants.length : 0)}</p>
                    <button onclick="registerForActivity(${activity.id})">Inscrever-se</button>
                    <button onclick="cancelRegistration(${activity.id})">Cancelar Inscrição</button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
    }
}

// Função para inscrever-se em uma atividade
async function registerForActivity(activityId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/activities/${activityId}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token JWT
            }
        });

        if (response.ok) {
            alert('Inscrição realizada com sucesso!');
            loadActivities(); // Recarrega as atividades
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Erro ao se inscrever:', error);
    }
}

// Função para cancelar inscrição
async function cancelRegistration(activityId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/activities/${activityId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token JWT
            }
        });

        if (response.ok) {
            alert('Inscrição cancelada com sucesso!');
            loadActivities(); // Recarrega as atividades
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Erro ao cancelar inscrição:', error);
    }
}

// Função para fazer login
async function login(email, password) {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            // Armazena o token no localStorage
            localStorage.setItem('token', data.token);
            console.log('Token armazenado:', data.token);
            alert('Login realizado com sucesso!');
            window.location.href = 'index.html'; // Redireciona para a página principal
        } else {
            alert(data.message); // Exibe mensagem de erro
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Verifique o console para mais detalhes.');
    }
}

// Adiciona um listener para o formulário de login
document.getElementById('login-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

// Carrega as atividades ao carregar a página
window.onload = () => {
    if (window.location.pathname.endsWith('index.html')) {
        loadActivities();
    }
};