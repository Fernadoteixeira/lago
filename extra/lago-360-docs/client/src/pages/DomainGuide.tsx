/**
 * Design: Atlas de Operação — guia profundo reutiliza uma mesma estrutura de dossiê,
 * sempre ligando domínio, contrato, estágio causal e ação técnica seguinte.
 */
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowUpRight, CircleCheck, FileCode2, GitBranch, MapPinned } from "lucide-react";
import { getCoverageDomain } from "@/data/coverage";
import { commercialDossiers } from "@/data/commercial";

const domainEvidence = {
  fundamentos: {
    items: [
      ["Servidores", "O contrato 1.51.0 declara os clusters US e EU. A base deve ser variável de ambiente e permanecer consistente em toda a execução."],
      ["Autenticação", "A especificação global declara `bearerAuth` com esquema HTTP bearer. Segredos não devem ser incorporados aos exemplos ou ao frontend estático."],
      ["Identidade", "IDs externos e transaction_id devem permanecer estáveis entre emissão, consulta, retry e auditoria."],
    ],
    snippet: `export LAGO_API_URL="https://api.getlago.com/api/v1"\nexport LAGO_API_KEY="<chave-bearer>"\n\ncurl "$LAGO_API_URL/invoices" \\\n  --header "Authorization: Bearer $LAGO_API_KEY"`,
    source: "OpenAPI 1.51.0 · servers e security global",
  },
  eventos: {
    items: [
      ["Envelope", "O lote reúne eventos independentes. Cada item mantém seu transaction_id para que aceite, falha e reprocessamento sejam endereçáveis."],
      ["Diagnóstico", "Erros por item devem separar códigos inválidos, propriedades de agregação ausentes e filtros inválidos dos eventos já aceitos."],
      ["Retry", "O reenvio deve conter somente itens corrigidos, preservando a identidade de transação e a trilha de auditoria."],
    ],
    snippet: `POST /events/batch\nAuthorization: Bearer $LAGO_API_KEY\n\n{\n  "events": [{\n    "transaction_id": "evt-2026-0001",\n    "external_subscription_id": "sub-acme-pro",\n    "code": "api_calls"\n  }]\n}`,
    source: "OpenAPI 1.51.0 · Events e batch events",
  },
} as const;

export default function DomainGuide() {
  const [, params] = useRoute("/docs/:slug");
  const domain = getCoverageDomain(params?.slug);

  if (!domain) {
    return <main className="min-h-screen bg-[#edf0ea] px-8 py-16 text-[#15262a]"><Link href="/coverage" className="inline-flex items-center gap-2 text-[#0e5968]"><ArrowLeft size={16} />Voltar para a matriz</Link><h1 className="mt-10 font-[Space_Grotesk] text-5xl font-bold tracking-[-.07em]">Domínio não encontrado.</h1></main>;
  }

  const guideHref = domain.existingGuide ?? "/#openapi";
  const evidence = domainEvidence[domain.slug as keyof typeof domainEvidence];
  const commercial = commercialDossiers[domain.slug];
  return (
    <div className="min-h-screen bg-[#edf0ea] text-[#15262a] [background-image:radial-gradient(#bed0ca_0.7px,transparent_0.7px)] [background-size:11px_11px]">
      <header className="flex min-h-14 items-center justify-between border-b border-[#c3cec8] px-[70px] font-mono text-[11px] tracking-[.06em] text-[#57706f] max-[800px]:px-6"><Link href="/coverage" className="inline-flex items-center gap-2 text-[#0e5968]"><ArrowLeft size={15} />MATRIZ 360º</Link><span>GUIA DE DOMÍNIO · {domain.order}</span></header>
      <main className="px-[70px] py-16 max-[800px]:px-6">
        <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(280px,.85fr)] gap-14 max-[900px]:grid-cols-1">
          <section>
            <p className="eyebrow">{domain.flowStage} / {domain.status}</p>
            <h1 className="mt-4 max-w-[780px] font-[Space_Grotesk] text-[clamp(48px,6.5vw,88px)] font-bold leading-[.88] tracking-[-.08em]">{domain.title}.</h1>
            <p className="mt-8 max-w-[650px] text-xl leading-[1.42] text-[#455e5d]">{domain.scope}</p>
            <div className="mt-12 border-t-[5px] border-[#0e5968] bg-[#f6f8f2] p-7">
              <div className="grid grid-cols-[28px_1fr] gap-4"><FileCode2 className="text-[#0e5968]" size={23} /><div><span className="font-mono text-[10px] tracking-[.08em] text-[#58716e]">FOCO DO CONTRATO</span><p className="mt-2 text-[17px] leading-[1.45] text-[#274044]">{domain.contractFocus}</p></div></div>
              <div className="mt-7 grid grid-cols-[28px_1fr] gap-4 border-t border-[#c3cec8] pt-6"><GitBranch className="text-[#0e5968]" size={23} /><div><span className="font-mono text-[10px] tracking-[.08em] text-[#58716e]">PRÓXIMA IMPLEMENTAÇÃO</span><p className="mt-2 text-[17px] leading-[1.45] text-[#274044]">{domain.nextTask}</p></div></div>
            </div>
          </section>
          <aside className="self-start bg-[#102f37] p-7 text-[#eaf0e7]">
            <span className="font-mono text-[10px] tracking-[.1em] text-[#b9ceca]">DOSSÍÊ {domain.order}</span>
            <h2 className="mt-3 font-[Space_Grotesk] text-3xl font-bold leading-none tracking-[-.06em]">Rota de evidência</h2>
            <ol className="mt-8 space-y-6 border-l border-dashed border-[#6c8586] pl-5">
              <li><span className="font-mono text-[10px] text-[#d8ff64]">01 / FONTE</span><p className="mt-1 text-sm leading-[1.35] text-[#d3dfdb]">Bundle OpenAPI 1.51.0 e raws com inventário.</p></li>
              <li><span className="font-mono text-[10px] text-[#d8ff64]">02 / GUIA</span><p className="mt-1 text-sm leading-[1.35] text-[#d3dfdb]">Explicação funcional, payload, resposta e exceções.</p></li>
              <li><span className="font-mono text-[10px] text-[#d8ff64]">03 / PROVA</span><p className="mt-1 text-sm leading-[1.35] text-[#d3dfdb]">Exemplo SDK e teste de contrato verificável.</p></li>
            </ol>
            <a href={guideHref} className="mt-9 flex min-h-11 items-center justify-center gap-2 border border-[#d8ff64]/80 font-mono text-[11px] text-[#d8ff64]"><MapPinned size={15} />Abrir ponto atual no Atlas <ArrowUpRight size={14} /></a>
          </aside>
        </div>
        <section className="mt-16 border-t border-[#c3cec8] pt-8"><div className="flex items-center gap-3"><CircleCheck size={19} className="text-[#0e5968]" /><h2 className="font-[Space_Grotesk] text-3xl font-bold tracking-[-.05em]">Gate de prontidão do domínio</h2></div><p className="mt-4 max-w-[800px] text-[17px] leading-[1.5] text-[#4d6060]">Este guia passa de mapeado para implementado quando a operação possui narrativa de negócio, exemplo executável, cenário de erro, referência OpenAPI e teste de contrato. O estado atual permanece visível na matriz para orientar a ordem de entrega.</p></section>
        {commercial && <section className="mt-14 border-t border-[#c3cec8] pt-8">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(280px,.78fr)] gap-10 max-[900px]:grid-cols-1"><div><p className="eyebrow">Corte canônico / {domain.shortTitle}</p><h2 className="mt-3 max-w-[730px] font-[Space_Grotesk] text-4xl font-bold tracking-[-.06em]">Contrato, decisão e transição na mesma trilha.</h2><p className="mt-5 max-w-[760px] text-[17px] leading-[1.55] text-[#455e5d]">{commercial.lead}</p></div><div className="border-l-4 border-[#d8ff64] bg-[#102f37] p-6 text-[#eaf0e7] max-[900px]:border-l-0 max-[900px]:border-t-4"><span className="font-mono text-[10px] tracking-[.09em] text-[#d8ff64]">CADEIA CAUSAL</span><ol className="mt-5 space-y-3">{commercial.transitions.map((transition, index) => <li className="flex items-center gap-3" key={transition}><span className="flex h-6 w-6 items-center justify-center border border-[#6c8586] font-mono text-[10px] text-[#d8ff64]">0{index + 1}</span><span className="text-sm text-[#d3dfdb]">{transition}</span></li>)}</ol></div></div>
          <div className="mt-10 grid grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)] gap-10 max-[900px]:grid-cols-1"><div><div className="border-t-4 border-[#0e5968]"><div className="grid grid-cols-[100px_minmax(130px,1.2fr)_minmax(0,1.4fr)] border-b border-[#c3cec8] py-3 font-mono text-[10px] tracking-[.06em] text-[#58716e] max-[650px]:hidden"><span>MÉTODO</span><span>CONTRATO</span><span>DECISÃO</span></div>{commercial.operations.map((operation) => <div className="grid grid-cols-[100px_minmax(130px,1.2fr)_minmax(0,1.4fr)] gap-3 border-b border-[#c3cec8] py-5 max-[650px]:grid-cols-1" key={`${operation.method}-${operation.path}`}><span className="w-fit bg-[#d8ff64] px-2 py-1 font-mono text-[10px] text-[#15262a]">{operation.method}</span><div><p className="font-mono text-[13px] text-[#0e5968]">{operation.path}</p><p className="mt-1 font-mono text-[10px] text-[#6b8280]">{operation.input}</p></div><p className="text-[14px] leading-[1.45] text-[#455e5d]">{operation.purpose}</p></div>)}</div></div><div><span className="font-mono text-[10px] tracking-[.09em] text-[#0e5968]">PRÉ-CONDIÇÕES</span><ul className="mt-4 space-y-4 border-y border-[#c3cec8] py-5">{commercial.prerequisites.map((item, index) => <li className="grid grid-cols-[22px_1fr] gap-3 text-[14px] leading-[1.45] text-[#455e5d]" key={item}><span className="font-mono text-[10px] text-[#0e5968]">0{index + 1}</span>{item}</li>)}</ul><div className="mt-6 border-l-4 border-[#0e5968] bg-[#e3e9e3] p-5"><span className="font-mono text-[10px] tracking-[.08em] text-[#0e5968]">EXCEÇÃO OPERACIONAL</span><p className="mt-3 text-[14px] leading-[1.5] text-[#455e5d]">{commercial.exception}</p></div></div></div>
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)_minmax(280px,.75fr)] gap-8 border-t border-[#c3cec8] pt-8 max-[900px]:grid-cols-1"><div className="bg-[#102f37] p-6 text-[#eaf0e7]"><span className="font-mono text-[10px] tracking-[.08em] text-[#d8ff64]">PAYLOAD CANÔNICO</span><pre className="mt-5 whitespace-pre-wrap break-words font-mono text-[12px] leading-[1.55] text-[#d3dfdb]">{commercial.snippet}</pre></div><p className="self-end font-mono text-[11px] leading-[1.55] text-[#58716e]">FONTE · {commercial.source}</p></div>
        </section>}
        {evidence && <section className="mt-14 grid grid-cols-[minmax(0,1fr)_minmax(320px,.82fr)] gap-8 border-t border-[#c3cec8] pt-8 max-[900px]:grid-cols-1"><div><p className="eyebrow">Evidência inicial / {domain.shortTitle}</p><h2 className="mt-3 font-[Space_Grotesk] text-3xl font-bold tracking-[-.05em]">Configuração que pode ser verificada.</h2><div className="mt-7 divide-y divide-[#c3cec8] border-y border-[#c3cec8]">{evidence.items.map(([label, content]) => <div className="grid grid-cols-[110px_1fr] gap-4 py-5 max-[560px]:grid-cols-1 max-[560px]:gap-2" key={label}><span className="font-mono text-[10px] tracking-[.08em] text-[#0e5968]">{label.toUpperCase()}</span><p className="text-[15px] leading-[1.45] text-[#455e5d]">{content}</p></div>)}</div></div><div className="bg-[#102f37] p-6 text-[#eaf0e7]"><span className="font-mono text-[10px] tracking-[.08em] text-[#d8ff64]">EXEMPLO DE REFERÊNCIA</span><pre className="mt-5 whitespace-pre-wrap break-words font-mono text-[12px] leading-[1.55] text-[#d3dfdb]">{evidence.snippet}</pre><p className="mt-6 border-t border-[#587172] pt-4 font-mono text-[10px] leading-[1.4] text-[#b9ceca]">FONTE · {evidence.source}</p></div></section>}
      </main>
    </div>
  );
}
