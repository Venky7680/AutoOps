import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Terminal, Search, Shield, Zap, Layers, ChevronRight, Activity, GitCommit, Cpu, PlayCircle, Sun, Moon, X, ArrowDownRight, Bot, MessageSquare, Sparkles, Cloud, Database, Server, HardDrive } from 'lucide-react'
import { useAppStore } from '../store/appStore'

import darkLogo from '../AutoOps-Darklogo.png'
import darkText from '../Dark-text.png'
import aiopsLogo from '../AIOps-logo.png'
import lightText from '../Light-text.png'

import runbooksDark from '../assets/logos/runbooks_dark.png'
import runbooksLight from '../assets/logos/runbooks_light.png'
import accessDark from '../assets/logos/access_dark.png'
import accessLight from '../assets/logos/access_light.png'
import auditDark from '../assets/logos/audit_dark.png'
import auditLight from '../assets/logos/audit_light.png'
import discoveryDark from '../Env-discovery-dark.png'
import discoveryLight from '../Env-discovery-light.png'
import exeDark from '../exe-dark.png'
import exeLight from '../exe-light.png'
import succDark from '../succ-dark.png'
import succLight from '../succ-light.png'

export default function LandingPage() {
  const navigate = useNavigate()
  const theme = useAppStore(s => s.theme)
  const toggleTheme = useAppStore(s => s.toggleTheme)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const currentLogo = theme === 'dark' ? darkLogo : aiopsLogo
  const currentText = theme === 'dark' ? darkText : lightText

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#02040a] text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-blue-500/30 relative transition-colors duration-300">

      {/* ─── Global Background Effects ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle base grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] transition-colors duration-300" />

        {/* Mouse interactive bright grid pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#00000020_1px,transparent_1px),linear-gradient(to_bottom,#00000020_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:40px_40px] transition-colors duration-300"
          style={{
            maskImage: `radial-gradient(400px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(400px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), black 0%, transparent 100%)`
          }}
        />

        {/* Ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 dark:bg-blue-600/30 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/15 dark:bg-indigo-600/30 blur-[150px]" />
      </div>



      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-[#02040a]/70 transition-colors duration-300">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={currentLogo} alt="AutoOps Logo" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300" />
          <img src={currentText} alt="AutoOps" className="h-5 object-contain" />
        </div>

        <div className="hidden lg:flex items-center gap-10 text-sm font-semibold text-slate-600 dark:text-slate-400">
          <a href="#platform" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1.5 group">Platform <ChevronRight size={14} className="rotate-90 opacity-50 group-hover:opacity-100 transition-opacity" /></a>
          <a href="#solutions" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1.5 group">Agentic Solutions <ChevronRight size={14} className="rotate-90 opacity-50 group-hover:opacity-100 transition-opacity" /></a>
          <a href="#resources" className="hover:text-blue-600 dark:hover:text-white transition-colors">Resources</a>
          <a href="#pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Login</button>
          <button onClick={() => setIsDemoModalOpen(true)} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-[#02040a] text-sm font-bold rounded-full transition-all hover:scale-105 hover:bg-blue-600 dark:hover:bg-slate-200 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            Book a Demo
          </button>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="pt-28 pb-32 px-6 max-w-7xl mx-auto text-center relative z-10">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium mb-10 shadow-md dark:shadow-xl backdrop-blur-md transition-colors">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> AutoOps 2.0 is now live
        </div>

        <h1 className="text-6xl md:text-[5.5rem] font-black mb-8 tracking-tighter leading-[1.05] drop-shadow-sm dark:drop-shadow-2xl">
          Agentic <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400 drop-shadow-sm dark:drop-shadow-lg">Developer Portal</span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed font-medium transition-colors">
          Build your own context lake to boost agent's decision making. <br className="hidden md:block" /> Guardrail what agents do. Scope what they see.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-lg font-bold rounded-full transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(37,99,235,0.3)] dark:shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] dark:hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1">
            Check live demo <PlayCircle size={20} />
          </button>
          <button onClick={() => setIsDemoModalOpen(true)} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 text-lg font-bold rounded-full transition-all shadow-sm backdrop-blur-md">
            Book a Demo
          </button>
        </div>

        {/* Premium Abstract Visual */}
        <div className="mt-28 relative mx-auto max-w-6xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 dark:from-blue-600 dark:via-indigo-600 dark:to-cyan-600 rounded-[2.5rem] blur-xl dark:blur-3xl opacity-30 dark:opacity-40" />
          <div className="relative rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0f1c]/80 backdrop-blur-2xl p-4 shadow-2xl dark:shadow-[0_0_80px_rgba(37,99,235,0.15)] transition-colors">
            <div className="rounded-[1.5rem] bg-slate-50 dark:bg-[#02040a] border border-slate-100 dark:border-white/10 h-[400px] md:h-[600px] flex flex-col relative overflow-hidden shadow-inner transition-colors">

              {/* Browser Chrome */}
              <div className="h-14 border-b border-slate-200 dark:border-white/5 flex items-center px-6 gap-2 bg-white/50 dark:bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="ml-6 flex-1 h-7 rounded-md bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/5 flex items-center justify-center text-xs text-slate-500 font-mono tracking-widest shadow-sm dark:shadow-inner transition-colors">
                  autoops.internal/dashboard
                </div>
              </div>

              {/* Inner UI Grid */}
              <div className="flex-1 p-8 flex gap-8 relative z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 dark:from-blue-900/10 via-transparent to-transparent">
                {/* Sidebar */}
                <div className="w-64 space-y-4 hidden lg:flex flex-col border-r border-slate-200 dark:border-white/5 pr-8">
                  <div className="h-12 rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 w-full flex items-center px-4 gap-3 text-blue-600 dark:text-blue-400 font-semibold text-sm shadow-sm dark:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-colors"><Layers size={18} /> Runbook Library</div>
                  <div className="h-12 rounded-xl bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent w-full flex items-center px-4 gap-3 text-slate-600 dark:text-slate-400 font-medium text-sm transition-colors cursor-pointer"><Terminal size={18} /> Executions</div>
                  <div className="h-12 rounded-xl bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent w-full flex items-center px-4 gap-3 text-slate-600 dark:text-slate-400 font-medium text-sm transition-colors cursor-pointer"><Shield size={18} /> Access Control</div>
                  <div className="mt-auto h-32 rounded-xl bg-gradient-to-br from-slate-100 dark:from-white/5 to-transparent border border-slate-200 dark:border-white/5 p-4 flex flex-col justify-between transition-colors">
                    <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center"><Activity size={16} className="text-blue-600 dark:text-blue-400" /></div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">System Health</div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="h-56 rounded-2xl bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/5 relative overflow-hidden p-8 shadow-sm dark:shadow-lg group transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 group-hover:bg-cyan-400 transition-colors" />
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Executions</h3>
                      <div className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-500/20 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" /> Live feed
                      </div>
                    </div>

                    {/* Fake Code / Metrics */}
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#02040a] p-3 rounded-lg border border-slate-100 dark:border-white/5 transition-colors">
                        <GitCommit size={14} className="text-blue-500" /> <span className="text-blue-600 dark:text-blue-300">User Onboarding</span> <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">2s ago</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#02040a] p-3 rounded-lg border border-slate-100 dark:border-white/5 transition-colors">
                        <GitCommit size={14} className="text-purple-500" /> <span className="text-purple-600 dark:text-purple-300">Cloud Infra</span> <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">12s ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 flex-1">
                    <div className="flex-1 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0a0f1c] dark:to-[#02040a] border border-slate-200 dark:border-white/5 p-8 shadow-sm dark:shadow-lg flex flex-col items-center justify-center text-center group hover:border-blue-400 dark:hover:border-blue-500/30 transition-colors">
                      <div className="h-20 w-20 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm dark:shadow-[0_0_30px_rgba(37,99,235,0.2)] overflow-hidden">
                        <img src={theme === 'dark' ? exeDark : exeLight} alt="Executions" className="w-full h-full object-cover scale-[1.15]" />
                      </div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">1.2M</div>
                      <div className="text-sm font-medium text-slate-500">Executions / month</div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0a0f1c] dark:to-[#02040a] border border-slate-200 dark:border-white/5 p-8 shadow-sm dark:shadow-lg flex flex-col items-center justify-center text-center group hover:border-purple-400 dark:hover:border-purple-500/30 transition-colors">
                      <div className="h-20 w-20 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm dark:shadow-[0_0_30px_rgba(168,85,247,0.2)] overflow-hidden">
                        <img src={theme === 'dark' ? succDark : succLight} alt="Success Rate" className="w-full h-full object-cover scale-[1.15]" />
                      </div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">99.9%</div>
                      <div className="text-sm font-medium text-slate-500">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── H2: Automate operational workflows ─── */}
      <section className="py-32 max-w-7xl mx-auto px-6 relative z-10 border-t border-slate-200 dark:border-transparent transition-colors">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter text-slate-900 dark:text-white">Automate operational workflows.</h2>
          <p className="text-2xl text-slate-600 dark:text-slate-400 font-medium">Define your runbooks. Filter your environments. Execute safely. <br className="hidden md:block" /> <span className="text-slate-900 dark:text-white">Full audit trail included.</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {/* Card 1 */}
          <div className="bg-white/80 dark:bg-[#0a0f1c]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all hover:-translate-y-2 group shadow-xl dark:shadow-[0_0_40px_rgba(37,99,235,0.1)] hover:dark:shadow-[0_0_60px_rgba(37,99,235,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30 transition-colors" />
            <div className="h-20 w-20 rounded-[1.5rem] overflow-hidden mb-10 relative z-10 group-hover:scale-110 transition-transform shadow-xl dark:shadow-[0_0_30px_rgba(37,99,235,0.15)] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1c] flex items-center justify-center">
              <img src={theme === 'dark' ? runbooksDark : runbooksLight} alt="Automated Runbooks" className="w-full h-full object-cover scale-[1.15]" />
            </div>
            <h3 className="text-4xl font-bold mb-6 tracking-tight relative z-10 text-slate-900 dark:text-white">Automated Runbooks</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-12 relative z-10 font-medium">Turn tribal knowledge into executable code. Centralize your scripts, commands, and workflows into standard, repeatable runbooks that anyone on the team can safely execute.</p>
            <a href="#" className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 hover:gap-4 transition-all text-lg relative z-10">Explore Runbooks <ArrowRight size={20} /></a>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 dark:bg-[#0a0f1c]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all hover:-translate-y-2 group shadow-xl dark:shadow-[0_0_40px_rgba(168,85,247,0.1)] hover:dark:shadow-[0_0_60px_rgba(168,85,247,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 dark:bg-purple-500/20 blur-[80px] rounded-full group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 transition-colors" />
            <div className="h-20 w-20 rounded-[1.5rem] overflow-hidden mb-10 relative z-10 group-hover:scale-110 transition-transform shadow-xl dark:shadow-[0_0_30px_rgba(168,85,247,0.15)] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1c] flex items-center justify-center">
              <img src={theme === 'dark' ? accessDark : accessLight} alt="Access Control" className="w-full h-full object-cover scale-[1.15]" />
            </div>
            <h3 className="text-4xl font-bold mb-6 tracking-tight relative z-10 text-slate-900 dark:text-white">Access Control (ACL)</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-12 relative z-10 font-medium">Secure access down to the specific target environment. Implement strict ACL policies to define exactly who can view, run, or edit specific workflows and resources.</p>
            <a href="#" className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-2 hover:gap-4 transition-all text-lg relative z-10">Explore Security <ArrowRight size={20} /></a>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 dark:bg-[#0a0f1c]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12 hover:border-green-300 dark:hover:border-green-500/40 transition-all hover:-translate-y-2 group shadow-xl dark:shadow-[0_0_40px_rgba(34,197,94,0.1)] hover:dark:shadow-[0_0_60px_rgba(34,197,94,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 dark:bg-green-500/20 blur-[80px] rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-500/30 transition-colors" />
            <div className="h-20 w-20 rounded-[1.5rem] overflow-hidden mb-10 relative z-10 group-hover:scale-110 transition-transform shadow-xl dark:shadow-[0_0_30px_rgba(34,197,94,0.15)] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1c] flex items-center justify-center">
              <img src={theme === 'dark' ? auditDark : auditLight} alt="Execution Audit Trails" className="w-full h-full object-cover scale-[1.15]" />
            </div>
            <h3 className="text-4xl font-bold mb-6 tracking-tight relative z-10 text-slate-900 dark:text-white">Execution Audit Trails</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-12 relative z-10 font-medium">Maintain complete visibility. Every action, script output, and infrastructure change is logged with granular detail for compliance and rapid debugging.</p>
            <a href="#" className="text-green-600 dark:text-green-400 font-bold flex items-center gap-2 hover:gap-4 transition-all text-lg relative z-10">Explore Audit Logs <ArrowRight size={20} /></a>
          </div>

          {/* Card 4 */}
          <div className="bg-white/80 dark:bg-[#0a0f1c]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12 hover:border-orange-300 dark:hover:border-orange-500/40 transition-all hover:-translate-y-2 group shadow-xl dark:shadow-[0_0_40px_rgba(168,85,247,0.1)] hover:dark:shadow-[0_0_60px_rgba(168,85,247,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 dark:bg-orange-500/20 blur-[80px] rounded-full group-hover:bg-orange-200 dark:group-hover:bg-orange-500/30 transition-colors" />
            <div className="h-20 w-20 rounded-[1.5rem] overflow-hidden mb-10 relative z-10 group-hover:scale-110 transition-transform shadow-xl dark:shadow-[0_0_30px_rgba(168,85,247,0.15)] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1c] flex items-center justify-center">
              <img src={theme === 'dark' ? discoveryDark : discoveryLight} alt="Environment Discovery" className="w-full h-full object-cover scale-[1.15]" />
            </div>
            <h3 className="text-4xl font-bold mb-6 tracking-tight relative z-10 text-slate-900 dark:text-white">Environment Discovery</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-12 relative z-10 font-medium">Automatically synchronize your infrastructure. Dynamically route automations to the correct targets based on tags, without hardcoding static IP lists.</p>
            <a href="#" className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-2 hover:gap-4 transition-all text-lg relative z-10">Explore Discovery <ArrowRight size={20} /></a>
          </div>
        </div>
        {/* Workflow Automation Flowchart (Storytelling) */}
        <div className="text-center max-w-3xl mx-auto mb-20 mt-10">
          <h3 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">The Anatomy of an Automation</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">See how AutoOps handles a complex operational request from start to finish with complete safety and auditability.</p>
        </div>

        <div className="relative max-w-5xl mx-auto pb-20 px-4 md:px-0">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 opacity-20 rounded-full" />

          {/* Step 1: Trigger */}
          <div className="relative flex flex-col md:flex-row items-center justify-between mb-24 group">
            <div className="hidden md:block w-5/12 text-right pr-16">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">1. The Request</h4>
              <p className="text-slate-600 dark:text-slate-400 font-medium">An incident is triggered via an alerting webhook, automatically invoking the remediation runbook.</p>
            </div>
            <div className="absolute left-[1.1rem] md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-500/20 border-4 border-slate-50 dark:border-[#02040a] flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] z-10 transition-transform duration-500 group-hover:scale-125">
              <Activity size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="w-full md:w-5/12 pl-24 md:pl-16 mt-4 md:mt-0">
              <div className="bg-white/80 dark:bg-[#0a0f1c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl dark:shadow-2xl group-hover:border-blue-300 dark:group-hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Incoming Webhook</span>
                </div>
                <pre className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#02040a] p-4 rounded-lg overflow-x-auto border border-slate-100 dark:border-white/5">
                  {`{
  "event": "incident.trigger",
  "service": "payment-api",
  "action": "restart_service"
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Step 2: Resolution & ACL */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-between mb-24 group">
            <div className="hidden md:block w-5/12 text-left pl-16">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">2. Policy Evaluation</h4>
              <p className="text-slate-600 dark:text-slate-400 font-medium">AutoOps intercepts the request, verifies the signature, and resolves target environments dynamically via tags.</p>
            </div>
            <div className="absolute left-[1.1rem] md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-500/20 border-4 border-slate-50 dark:border-[#02040a] flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)] z-10 transition-transform duration-500 group-hover:scale-125">
              <Shield size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="w-full md:w-5/12 pl-24 md:pr-16 md:pl-0 mt-4 md:mt-0">
              <div className="bg-white/80 dark:bg-[#0a0f1c]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl dark:shadow-2xl group-hover:border-purple-300 dark:group-hover:border-purple-500/50 transition-colors">
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 p-3 rounded-lg border border-green-200 dark:border-green-500/20 shadow-sm">
                    <span>✓ signature_valid</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 p-3 rounded-lg border border-blue-200 dark:border-blue-500/20 shadow-sm">
                    <span>✓ resolve: env=prod, app=payment</span>
                    <span className="text-xs font-bold opacity-80">3 targets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Execution */}
          <div className="relative flex flex-col md:flex-row items-center justify-between group">
            <div className="hidden md:block w-5/12 text-right pr-16">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">3. Secure Execution</h4>
              <p className="text-slate-600 dark:text-slate-400 font-medium">The runbook is securely executed across the target fleet. Real-time logs are captured and streamed back.</p>
            </div>
            <div className="absolute left-[1.1rem] md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-green-100 dark:bg-green-500/20 border-4 border-slate-50 dark:border-[#02040a] flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)] z-10 transition-transform duration-500 group-hover:scale-125">
              <Terminal size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="w-full md:w-5/12 pl-24 md:pl-16 mt-4 md:mt-0">
              <div className="bg-[#02040a] border border-slate-800 dark:border-white/10 rounded-2xl p-6 shadow-2xl group-hover:border-green-500/50 transition-colors">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="font-mono text-xs space-y-2">
                  <div className="text-slate-400"><span className="text-green-400">payment-web-01</span>: Service restarted successfully.</div>
                  <div className="text-slate-400"><span className="text-green-400">payment-web-02</span>: Service restarted successfully.</div>
                  <div className="text-slate-400"><span className="text-green-400">payment-web-03</span>: Service restarted successfully.</div>
                  <div className="text-blue-400 mt-4 font-bold">» Runbook completed in 4.2s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Move the needle ─── */}
      <section className="py-40 relative overflow-hidden border-t border-slate-200 dark:border-white/5 mt-10 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100 dark:from-blue-900/20 via-slate-50 dark:via-[#02040a] to-slate-50 dark:to-[#02040a] -z-10 transition-colors" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-[5rem] font-black mb-10 tracking-tighter leading-tight drop-shadow-lg dark:drop-shadow-2xl text-slate-900 dark:text-white">
            Move the needle with <br /> AutoOps.
          </h2>
          <p className="text-2xl text-slate-600 dark:text-slate-400 mb-16 font-medium">Prove the ROI of your initiatives. Unblock your developers today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button onClick={() => navigate('/login')} className="px-12 py-5 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-xl font-bold rounded-full transition-all shadow-xl dark:shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-2xl dark:hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3">
              Get Started for Free <ArrowRight size={22} />
            </button>
            <button onClick={() => navigate('/login')} className="px-12 py-5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 text-xl font-bold rounded-full transition-all backdrop-blur-md shadow-sm">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#02040a] pt-24 pb-12 px-6 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center gap-3 opacity-90 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={currentLogo} alt="AutoOps Logo" className="w-10 h-10 object-contain" />
              <img src={currentText} alt="AutoOps" className="h-7 object-contain" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed text-lg font-medium">The Agentic Internal Developer Portal that brings calm to your operational chaos.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-lg tracking-tight">Platform</h4>
            <ul className="space-y-5 text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Software Catalog</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Self-service Actions</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">RBAC & Security</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Scorecards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-lg tracking-tight">Resources</h4>
            <ul className="space-y-5 text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community Slack</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-lg tracking-tight">Company</h4>
            <ul className="space-y-5 text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500 font-semibold transition-colors">
          <div>© 2026 AutoOps. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* ─── Book a Demo Modal ─── */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsDemoModalOpen(false)} />

          <div className="relative w-full max-w-5xl bg-white dark:bg-[#0a0f1c] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-white/10">
            <button onClick={() => setIsDemoModalOpen(false)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 transition-colors z-10">
              <X size={20} />
            </button>

            {/* Left side */}
            <div className="w-full md:w-1/2 p-8 md:p-16 bg-slate-50 dark:bg-transparent flex flex-col justify-center relative">
              <div className="inline-block px-3 py-1 mb-8 rounded-full bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400 text-sm font-semibold w-fit border border-green-200 dark:border-green-500/20">
                Talk to an expert
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-10 tracking-tight leading-tight">
                Let AutoOps show you what developer portals are all about.
              </h2>

              <div className="space-y-6 text-slate-600 dark:text-slate-400 font-medium">
                <p className="text-lg text-slate-500">Get all your questions answered</p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <ArrowDownRight className="min-w-5 mt-1 opacity-70" size={20} />
                    <span>Get a clear understanding of what you'll have in a service catalog</span>
                  </li>
                  <li className="flex gap-3">
                    <ArrowDownRight className="min-w-5 mt-1 opacity-70" size={20} />
                    <span>Define the developer self-service routines that apply to you</span>
                  </li>
                  <li className="flex gap-3">
                    <ArrowDownRight className="min-w-5 mt-1 opacity-70" size={20} />
                    <span>Map the use of scorecards and automations</span>
                  </li>
                  <li className="flex gap-3">
                    <ArrowDownRight className="min-w-5 mt-1 opacity-70" size={20} />
                    <span>Understand the power of plugins and a single source of truth</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right side form */}
            <div className="w-full md:w-1/2 p-8 md:p-16 bg-white dark:bg-[#02040a] flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 relative">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Request a demo</h3>

              <form className="space-y-4">
                <div className="relative">
                  <input type="text" placeholder="First name *" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400" required />
                </div>
                <div className="relative">
                  <input type="text" placeholder="Last name *" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400" required />
                </div>
                <div className="relative">
                  <input type="email" placeholder="Business email *" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400" required />
                </div>
                <div className="relative">
                  <input type="text" placeholder="Job title" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0f1c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400" />
                </div>

                <button type="button" onClick={(e) => { e.preventDefault(); alert('Demo request submitted!'); setIsDemoModalOpen(false); }} className="w-full mt-6 py-4 bg-[#1a1a1a] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#02040a] font-bold rounded-xl transition-colors text-lg shadow-lg">
                  Continue
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
