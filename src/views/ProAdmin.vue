<template>
	<div class="min-h-screen bg-dark-900 py-8">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<h1 class="text-2xl font-bold text-gray-100 mb-6">PRO 申请审批（极简版）</h1>

			<div class="racing-card p-6">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-gray-100">待审批列表</h2>
					<button class="btn btn-secondary" @click="loadPending">刷新</button>
				</div>

				<div v-if="loading" class="text-gray-300">加载中…</div>
				<div v-else>
					<div v-if="apps.length === 0" class="text-gray-400">暂无待审批申请</div>
					<div v-else class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-700">
							<thead>
								<tr class="text-left text-gray-300">
									<th class="py-2 pr-4">申请ID</th>
									<th class="py-2 pr-4">用户ID</th>
									<th class="py-2 pr-4">Gamertag</th>
									<th class="py-2 pr-4">游戏经验</th>
									<th class="py-2 pr-4">提交时间</th>
									<th class="py-2 pr-4">操作</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-800">
								<tr v-for="app in apps" :key="app.id" class="text-gray-200">
									<td class="py-2 pr-4 text-xs text-gray-400">{{ app.id }}</td>
									<td class="py-2 pr-4 text-xs">{{ app.user_id || app.userId }}</td>
									<td class="py-2 pr-4">{{ app.gamertag }}</td>
									<td class="py-2 pr-4 max-w-md truncate" :title="app.experience">{{ app.experience }}</td>
									<td class="py-2 pr-4 text-sm">{{ formatTime(app.submitted_at || app.submittedAt) }}</td>
									<td class="py-2 pr-4 space-x-2">
										<button class="btn btn-primary" :disabled="processingId === app.id" @click="approve(app)">通过</button>
										<button class="btn btn-secondary" :disabled="processingId === app.id" @click="reject(app)">驳回</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/utils/api'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const { user } = useAuth()
const { success: toastSuccess, error: toastError } = useToast()

const apps = ref<any[]>([])
const loading = ref(false)
const processingId = ref<string | null>(null)

const loadPending = async () => {
	loading.value = true
	try {
		const data = await api.get<any[]>('/pro/applications', { params: { status: 'PENDING' } })
		apps.value = Array.isArray(data) ? data : []
	} catch (e) {
		apps.value = []
		toastError('加载失败', '无法获取待审批申请')
	} finally {
		loading.value = false
	}
}

const approve = async (app: any) => {
	if (!app?.id) return
	processingId.value = app.id
	try {
		await api.put(`/pro/applications/${app.id}`, null, { params: { status: 'APPROVED', reviewedBy: user.value?.id || 'admin', notes: '' } })
		toastSuccess('已通过', `已通过 ${app.gamertag} 的申请`)
		await loadPending()
	} catch (e) {
		toastError('操作失败', '通过申请失败，请稍后重试')
	} finally {
		processingId.value = null
	}
}

const reject = async (app: any) => {
	if (!app?.id) return
	processingId.value = app.id
	try {
		await api.put(`/pro/applications/${app.id}`, null, { params: { status: 'REJECTED', reviewedBy: user.value?.id || 'admin', notes: '' } })
		toastSuccess('已驳回', `已驳回 ${app.gamertag} 的申请`)
		await loadPending()
	} catch (e) {
		toastError('操作失败', '驳回申请失败，请稍后重试')
	} finally {
		processingId.value = null
	}
}

const formatTime = (ts?: string) => {
	if (!ts) return '-'
	try {
		return new Date(ts).toLocaleString()
	} catch { return ts }
}

onMounted(loadPending)
</script>


