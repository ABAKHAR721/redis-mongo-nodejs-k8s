# Node.js + Redis + MongoDB on Minikube

## 📌 Project Overview

This project demonstrates how to deploy a **Node.js** application that uses **MongoDB** as a database and **Redis** for caching inside a **Minikube Kubernetes cluster**.

## 🏗 Architecture

- **Node.js API**: A simple Express.js app that handles user data.
- **MongoDB**: Stores user information.
- **Redis**: Caches user data to improve performance.
- **Kubernetes**: Manages the deployment on a Minikube cluster.

---

## 🚀 Prerequisites

Ensure you have the following installed:

- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Docker](https://www.docker.com/products/docker-desktop)

---

## 📂 Project Structure

```
redis_mongo_k8s/
│── node-redis-mongo-app/
│   ├── index.js (Node.js API)
│   ├── package.json
│   ├── Dockerfile
│   ├── k8s/
│   │   ├── deployment.yaml (Kubernetes manifests)
│   │   ├── service.yaml
```

---

## 🛠 Setup & Deployment

### **1️⃣ Start Minikube**

```bash
minikube start
```

### **2️⃣ Enable Minikube Addons** (Optional, for dashboard)

```bash
minikube addons enable dashboard
minikube dashboard
```

### **3️⃣ Deploy MongoDB & Redis**

```bash
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
```

### **4️⃣ Deploy the Node.js Application**

```bash
kubectl apply -f k8s/node-deployment.yaml
```

### **5️⃣ Get Node.js Service URL**

```bash
kubectl get svc node-service
```

Copy the **Minikube IP** and exposed port.

---

## 🔥 API Endpoints & Testing

### **1️⃣ Create a User (POST request)**

```bash
curl -X POST http://<MINIKUBE-IP>:<PORT>/user \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com"}'
```

### **2️⃣ Fetch a User (First time - MongoDB, Cached in Redis)**

```bash
curl http://<MINIKUBE-IP>:<PORT>/user/john@example.com
```

*Expected output: Data fetched from MongoDB (Cache Miss)*

### **3️⃣ Fetch the same User again (Cached in Redis)**

```bash
curl http://<MINIKUBE-IP>:<PORT>/user/john@example.com
```

*Expected output: Data fetched from Redis (Cache Hit)*

---

## 🛠 Debugging & Logs

### **Check Logs for Redis Caching**

```bash
kubectl logs -l app=node-app
```

*Expected output:*

```
Cache miss
Cache hit
Cache hit
Cache hit
```

### **Connect to Redis & Inspect Cache**

```bash
kubectl exec -it redis-pod-name -- redis-cli
```

Run inside Redis CLI:

```bash
KEYS *
GET user:john@example.com
```

*Expected output: Cached JSON data*

---

## 🎉 Conclusion

You have successfully deployed a **Node.js app** using **MongoDB** for storage and **Redis** for caching inside a **Minikube cluster**. 🚀🔥

Let me know if you need any improvements! 😊


