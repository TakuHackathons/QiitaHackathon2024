<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class BatchChatQuest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:batch-chat-quest';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'AIが英会話の問題生成';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $lists = ImageData::select()->where('status', 0)->first();
        if(!isset($lists->model_url)){
            exit;
        }

        if(trim($lists->model_url) == ""){
            exit;
        }

        Log::debug(__LINE__ . ' IMG PATH:' . print_r($lists, true));
        //
        $path = $lists->model_url;
        $lists->status = 1;
        $lists->save();

        $lang = 0;
        if(isset($lists->line_mid)){
            $u = User::Select()->where('line_mid',$lists->line_mid )->first();
            if(isset($u->language)){
                $lang = $u->language;
                $maxcal = $u->kcal;
            }
        }

        $response = $this->__ai_diet_scope($path,$lang,$maxcal);
        if($response){
            $lists->status = 2;
            $lists->advise = trim($response[0]["text"]);
            $lists->save();
            Log::debug(__LINE__ . ' ファイル更新完了');
        }else{
            Log::debug(__LINE__ . ' ファイル更新失敗');
        }
        print "end";
    }

    /**
     * @param $path
     * @param $lang
     * @param $toeic
     * @return mixed
     */
    private function __ai_scope($path = "", $lang = 0,$toeic =500)
    {
        Log::debug(__LINE__ . ' LANG:'. $lang);

        // 話題からお台を出す
        $commandText = sprintf("このユーザーはTOEIC%d程度の英語スキルです。貴方はネイティブな英語発話者です。",$toeic);
        $commandText .= sprintf("「%d」を話題に、英語で説明してあげたいです。",$lang);
        $commandText .= "その説明が終わったら、１問から３問の質問を英語でしてあげてください。";
        if($lang > 0){
            $langA = array(
                "Japanese",
                "なお、出力は英語で出力すること",
                "なお、出力はスペイン語で出力すること",
                "なお、出力は中国語で出力すること",
                "なお、出力は韓国語で出力すること",
            );
            if(isset($langA[$lang])){
                $commandText .= $langA[$lang];
            }
        }

        $pictureTxt = array(
            "type" => "text",
            "text" => $commandText,
        );

        $message = array(
            "role" => "user",
            "content" => [$pictureTxt],
        );

        $data = array(
            'model' => 'claude-3-sonnet-20240229',
            "max_tokens" => 1024,
            "messages" => [$message],
        );
        Log::debug(__LINE__ . ' DEBUG PROMPT:', (array)$data);

        $response = $this->__anthropicMessage($data);
        Log::debug(__LINE__ . ' DEBUG:', $response);
        Log::debug(__LINE__ . ' DEBUG CONTENT:', $response["content"]);
        return $response["content"];
    }

    /**
     * @param $data
     * @return mixed
     */
    private function __anthropicMessage($data)
    {

        $apiKey = config('services.anthropic.apikey');
        $anthropicVersion = "2023-06-01";

        $options = array(
            CURLOPT_URL => 'https://api.anthropic.com/v1/messages',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => array(
                'x-api-key: ' . $apiKey,
                'anthropic-version: ' . $anthropicVersion,
                'content-type: application/json'
            ),
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data)
        );

        $curl = curl_init();
        curl_setopt_array($curl, $options);
        $api_response = curl_exec($curl);
        curl_close($curl);

        $response = json_decode($api_response, true);

        return $response;
    }

}
